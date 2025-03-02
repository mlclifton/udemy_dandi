import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import removeMd from 'remove-markdown';

interface RepoSummary {
  summary: string;
  coolFacts: string[];
}

/**
 * Converts markdown content to plain text, removing formatting, images, and links
 */
function cleanMarkdown(markdown: string): string {
  // Remove HTML tags first
  const noHtml = markdown.replace(/<[^>]*>/g, '');
  // Use remove-markdown to strip remaining markdown formatting
  const plainText = removeMd(noHtml);
  // Clean up extra whitespace
  return plainText
    .replace(/\n\s*\n/g, '\n\n')  // Replace multiple newlines with double newlines
    .replace(/\s+/g, ' ')         // Replace multiple spaces with single space
    .trim();                      // Remove leading/trailing whitespace
}

const SUMMARY_TEMPLATE = `You are a helpful assistant that analyzes GitHub repository README files.
Given the following README content, please provide:
1. A concise summary of what the repository is about (2-3 sentences)
2. Up to 5 interesting/cool facts about the repository or its features

README content:
{readme}

IMPORTANT: Respond with ONLY raw JSON, no markdown formatting, no code blocks, no backticks. The response should be a valid JSON object in this exact format:
{{
  "summary": "your summary here",
  "coolFacts": ["fact 1", "fact 2", "fact 3"]
}}`;

/**
 * Analyzes a README file content and returns a summary and cool facts using LangChain
 */
export async function analyzeReadmeContent(readmeContent: string): Promise<RepoSummary> {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('Google API key is not configured. Please set the GOOGLE_API_KEY environment variable.');
    }

    // Clean the markdown content first
    const cleanedContent = cleanMarkdown(readmeContent);

    // Initialize LangChain components with Gemini
    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-2.0-flash",
      maxOutputTokens: 2048,
      temperature: 0.7,
      apiKey: apiKey,
    });

    const prompt = PromptTemplate.fromTemplate(SUMMARY_TEMPLATE);

    // Create a processing chain
    const chain = RunnableSequence.from([
      prompt,
      model,
      new StringOutputParser(),
    ]);

    // Run the chain with cleaned content
    const result = await chain.invoke({
      readme: cleanedContent,
    });

    // Clean the response and parse JSON
    const cleanedResult = result.trim().replace(/^```json\s*|\s*```$/g, '');
    const parsedResult = JSON.parse(cleanedResult) as RepoSummary;

    return parsedResult;
  } catch (error: any) {
    console.error("Error analyzing README content:", error);
    throw error;
  }
}

/**
 * Fetches and summarizes a GitHub repository's README file
 */
export async function summarizeGitHubRepo(repoUrl: string): Promise<RepoSummary> {
  try {
    // Fetch README content from our API endpoint
    const response = await fetch("/api/github-summariser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubUrl: repoUrl }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch README: ${response.statusText}`);
    }

    const data = await response.json();
    const { readme } = data;
    
    // Use the helper function to analyze the README content
    return await analyzeReadmeContent(readme);
  } catch (error: any) {
    console.error("Error summarizing GitHub repo:", error);
    throw error;
  }
} 