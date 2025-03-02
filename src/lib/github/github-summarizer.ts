import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";
import removeMd from 'remove-markdown';

// Define the schema for the output
const repoSummarySchema = z.object({
  summary: z.string().describe("A concise 2-3 sentence summary of what the repository is about"),
  coolFacts: z.array(z.string()).describe("Up to 5 interesting or cool facts about the repository or its features"),
});

type RepoSummary = z.infer<typeof repoSummarySchema>;

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
Given the following README content, please provide a summary and cool facts about the repository.

README content:
{readme}

{format_instructions}`;

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

    // Initialize the parser with our schema
    const parser = StructuredOutputParser.fromZodSchema(repoSummarySchema);

    // Initialize LangChain components with Gemini
    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-2.0-flash",
      maxOutputTokens: 2048,
      temperature: 0.7,
      apiKey: apiKey,
    });

    const prompt = new PromptTemplate({
      template: SUMMARY_TEMPLATE,
      inputVariables: ["readme"],
      partialVariables: {
        format_instructions: parser.getFormatInstructions(),
      },
    });

    // Create a processing chain
    const chain = RunnableSequence.from([
      prompt,
      model,
      parser,
    ]);

    // Run the chain with cleaned content
    const result = await chain.invoke({
      readme: cleanedContent,
    });

    return result;
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    console.error("Error summarizing GitHub repo:", error);
    throw error;
  }
} 