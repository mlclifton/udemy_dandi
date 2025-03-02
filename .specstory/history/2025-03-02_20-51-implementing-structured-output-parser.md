## SpecStory

## Implementing Structured Output Parser (02/03/2025, 20:51:31)

_**User**_

I'd prefer to use a structuredoutputparser and use a schema for the "summary" and "cool_facts" fields

---

_**Assistant**_

I'll help you modify the code to use a `StructuredOutputParser` with a defined schema for better type safety and validation. I'll first explain what I'm going to do:

1. We'll define a proper schema using zod (which is commonly used with LangChain)
2. Replace the string template with a structured format
3. Update the chain to use the structured parser

Let me make these changes:

---

_****_

```diff
  import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
  import { PromptTemplate } from "@langchain/core/prompts";
- import { StringOutputParser } from "@langchain/core/output_parsers";
+ import { StructuredOutputParser } from "langchain/output_parsers";
+ import { z } from "zod";
  import { RunnableSequence } from "@langchain/core/runnables";
  import removeMd from 'remove-markdown';
  
- interface RepoSummary {
-   summary: string;
-   coolFacts: string[];
- }
+ // Define the schema for the output
+ const repoSummarySchema = z.object({
+   summary: z.string().describe("A concise 2-3 sentence summary of what the repository is about"),
+   coolFacts: z.array(z.string()).describe("Up to 5 interesting or cool facts about the repository or its features"),
+ });
+ 
+ type RepoSummary = z.infer<typeof repoSummarySchema>;
  
  /**
  
  const SUMMARY_TEMPLATE = `You are a helpful assistant that analyzes GitHub repository README files.
- Given the following README content, please provide:
- 1. A concise summary of what the repository is about (2-3 sentences)
- 2. Up to 5 interesting/cool facts about the repository or its features
+ Given the following README content, please provide a summary and cool facts about the repository.
  
  README content:
  {readme}
  
- IMPORTANT: Respond with ONLY raw JSON, no markdown formatting, no code blocks, no backticks. The response should be a valid JSON object in this exact format:
- {{
-   "summary": "your summary here",
-   "coolFacts": ["fact 1", "fact 2", "fact 3"]
- }}`;
+ {format_instructions}`;
  
  /**
      // Clean the markdown content first
      const cleanedContent = cleanMarkdown(readmeContent);
+ 
+     // Initialize the parser with our schema
+     const parser = StructuredOutputParser.fromZodSchema(repoSummarySchema);
  
      // Initialize LangChain components with Gemini
      });
  
-     const prompt = PromptTemplate.fromTemplate(SUMMARY_TEMPLATE);
+     const prompt = PromptTemplate.fromTemplate({
+       template: SUMMARY_TEMPLATE,
+       partialVariables: {
+         format_instructions: parser.getFormatInstructions(),
+       },
+     });
  
      // Create a processing chain
      const chain = RunnableSequence.from([
        prompt,
        model,
-       new StringOutputParser(),
+       parser,
      ]);
  
      });
  
-     // Clean the response and parse JSON
-     const cleanedResult = result.trim().replace(/^```json\s*|\s*```$/g, '');
-     const parsedResult = JSON.parse(cleanedResult) as RepoSummary;
- 
-     return parsedResult;
+     return result;
    } catch (error: unknown) {
      console.error("Error analyzing README content:", error);
```

---

_****_



I notice there's a linter error with the `PromptTemplate.fromTemplate()` call. Let me fix that by using the correct method signature:

---

_****_

```diff
      });
  
-     const prompt = PromptTemplate.fromTemplate({
+     const prompt = new PromptTemplate({
        template: SUMMARY_TEMPLATE,
+       inputVariables: ["readme"],
        partialVariables: {
          format_instructions: parser.getFormatInstructions(),
```

---

_****_



Great! I've made several improvements to the code:

1. Added Zod schema definition for better type safety and validation
2. Created a proper type definition using `z.infer`
3. Integrated `StructuredOutputParser` with the Zod schema
4. Updated the prompt template to use format instructions from the parser
5. Simplified the chain by removing manual JSON parsing
6. Fixed the `PromptTemplate` initialization to use the correct constructor

The key benefits of these changes are:

1. Better type safety with Zod schema validation
2. Clearer output format instructions for the model
3. Automatic parsing and validation of the model's response
4. No more manual JSON parsing or cleaning needed
5. Better error handling if the model returns an invalid format

The code should now work more reliably and provide better type safety. The structured output parser will ensure that the model's response matches our expected schema, and TypeScript will provide better type checking throughout the codebase.

Would you like me to make any additional improvements to the implementation?

---



---

