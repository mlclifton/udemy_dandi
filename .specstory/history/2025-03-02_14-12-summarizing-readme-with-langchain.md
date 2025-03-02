## SpecStory

## Summarizing README with LangChain (02/03/2025, 14:12:14)

_**User**_

I want you to create a new function that uses the LangChain library to send the contents of the readme file to an LLM and get back a short summary of what the readme file says along with a selection of upto 5 cool facts about the repo. The function should take the url of a github repo and return the summary and cool facts. Use the github-summariser endpoint to get the readme.md file of the repo.

---

_**Assistant**_

I'll help you create a function that uses LangChain to summarize GitHub repository README files. First, let me search if there are any existing relevant files to work with.

---

_****_

<details>
            <summary>Searched codebase "github summarizer langchain readme" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `src/app/api/github-summariser/route.ts` | L43-82 |
| `src/app/api/github-summariser/route.ts` | L82-118 |
| `src/app/api/github-summariser/route.ts` | L1-43 |
| `README.md` | L1-19 |
| `.specstory/history/2025-03-02_13-25-removing-debug-logs-from-@route-ts.md` | L1-60 |
| `.specstory/history/.what-is-this.md` | L1-54 |
| `package.json` | L1-36 |
| `src/app/layout.tsx` | L1-18 |
| `src/app/page.tsx` | L24-64 |
| `src/app/page.tsx` | L1-24 |
| `src/app/layout.tsx` | L18-34 |
| `src/app/page.tsx` | L64-114 |
| `next.config.ts` | L1-7 |
| `src/lib/database/supabase-repository.ts` | L1-13 |
| `tsconfig.json` | L1-28 |
| `src/components/Sidebar.tsx` | L12-64 |
| `src/app/dashboard/playground/page.tsx` | L34-60 |
| `.gitignore` | L1-45 |
| `tailwind.config.ts` | L1-18 |
| `dandi.code-workspace` | L1-8 |
| `src/app/dashboard/api-keys/page.tsx` | L230-281 |
| `eslint.config.mjs` | L1-16 |
| `src/lib/database/supabase-repository.ts` | L13-38 |
| `src/lib/database/supabase-repository.ts` | L38-52 |
| `.vscode/extensions.json` | L1-5 |

</details>

---

_****_



I see that we have a Next.js project with LangChain already set up as a dependency. I'll create a new function to summarize GitHub repositories using LangChain. First, let me check if there's a specific directory where we should put this functionality.

---

_****_

<details>
            <summary>Listed directory src/lib • **2** results</summary>
        
| Name |
|-------|
| 📄 `db.ts` |
| 📁 `database` |

</details>

---

_****_



I'll create a new directory for our GitHub-related utilities. Let me create a new file called `github-summarizer.ts` in a new `github` directory under `src/lib`.

---

_****_

```diff
- 
+ import { ChatOpenAI } from "@langchain/openai";
+ import { PromptTemplate } from "@langchain/core/prompts";
+ import { StringOutputParser } from "@langchain/core/output_parsers";
+ import { RunnableSequence } from "@langchain/core/runnables";
+ 
+ interface RepoSummary {
+   summary: string;
+   coolFacts: string[];
+ }
+ 
+ const SUMMARY_TEMPLATE = `You are a helpful assistant that analyzes GitHub repository README files.
+ Given the following README content, please provide:
+ 1. A concise summary of what the repository is about (2-3 sentences)
+ 2. Up to 5 interesting/cool facts about the repository or its features
+ 
+ README content:
+ {readme}
+ 
+ Respond in the following JSON format:
+ {
+   "summary": "your summary here",
+   "coolFacts": ["fact 1", "fact 2", ...]
+ }`;
+ 
+ export async function summarizeGitHubRepo(repoUrl: string): Promise<RepoSummary> {
+   try {
+     // Fetch README content from our API endpoint
+     const response = await fetch("/api/github-summariser", {
+       method: "POST",
+       headers: {
+         "Content-Type": "application/json",
+       },
+       body: JSON.stringify({ githubUrl: repoUrl }),
+     });
+ 
+     if (!response.ok) {
+       throw new Error(`Failed to fetch README: ${response.statusText}`);
+     }
+ 
+     const { readme } = await response.json();
+ 
+     // Initialize LangChain components
+     const model = new ChatOpenAI({
+       modelName: "gpt-3.5-turbo",
+       temperature: 0.7,
+     });
+ 
+     const prompt = PromptTemplate.fromTemplate(SUMMARY_TEMPLATE);
+ 
+     // Create a processing chain
+     const chain = RunnableSequence.from([
+       prompt,
+       model,
+       new StringOutputParser(),
+     ]);
+ 
+     // Run the chain
+     const result = await chain.invoke({
+       readme,
+     });
+ 
+     // Parse the JSON response
+     const parsedResult = JSON.parse(result) as RepoSummary;
+ 
+     return parsedResult;
+   } catch (error) {
+     console.error("Error summarizing GitHub repo:", error);
+     throw error;
+   }
+ } 
```

---

_****_



I've created a new function `summarizeGitHubRepo` that does exactly what you requested. Here's what the function does:

1. Takes a GitHub repository URL as input
2. Uses the existing `github-summariser` endpoint to fetch the README content
3. Uses LangChain to process the README content with the following components:
   - ChatOpenAI model (GPT-3.5-turbo)
   - A prompt template that asks for a summary and cool facts
   - A string output parser to handle the response
4. Returns a structured object containing:
   - A concise summary (2-3 sentences)
   - Up to 5 cool facts about the repository

The function uses modern LangChain features like `RunnableSequence` for the processing chain and structured prompting to ensure consistent output format.

To use this function, you'll need to make sure you have an OpenAI API key set in your environment variables. The function can be called like this:

```typescript
const result = await summarizeGitHubRepo("https://github.com/owner/repo");
console.log(result.summary);
console.log(result.coolFacts);
```

Would you like me to add any additional features to the function or make any modifications to how it works?

---

_**User**_

ok, so I want to re-factor the helper function from @github-summariser  so it takes a string which represents the readme file contents and uses that string rather than calling the github-summariser endpoint. The, I want you to call the helper function from @summarizeGitHubRepo()  API endpoint once it has the readme.md contents and finally return the summary from the helper function as the response form the API endpoint. 

---

_**Assistant**_

I'll help you refactor the code to separate the LangChain summarization logic from the GitHub README fetching. Let me first read the current API endpoint code.

---

_****_

Read file: src/app/api/github-summariser/route.ts

---

_****_



Now I'll refactor the code in two steps:

1. First, I'll modify the `github-summarizer.ts` to extract the LangChain summarization logic into a separate function
2. Then, I'll update the API endpoint to use this function

---

_****_

```diff
  }`;
  
- export async function summarizeGitHubRepo(repoUrl: string): Promise<RepoSummary> {
-   try {
-     // Fetch README content from our API endpoint
-     const response = await fetch("/api/github-summariser", {
-       method: "POST",
-       headers: {
-         "Content-Type": "application/json",
-       },
-       body: JSON.stringify({ githubUrl: repoUrl }),
-     });
- 
-     if (!response.ok) {
-       throw new Error(`Failed to fetch README: ${response.statusText}`);
-     }
- 
-     const { readme } = await response.json();
- 
+ /**
+  * Analyzes a README file content and returns a summary and cool facts using LangChain
+  */
+ export async function analyzeReadmeContent(readmeContent: string): Promise<RepoSummary> {
+   try {
      // Initialize LangChain components
      const model = new ChatOpenAI({
      // Run the chain
      const result = await chain.invoke({
-       readme,
+       readme: readmeContent,
      });
  
  
      return parsedResult;
+   } catch (error) {
+     console.error("Error analyzing README content:", error);
+     throw error;
+   }
+ }
+ 
+ /**
+  * Fetches and summarizes a GitHub repository's README file
+  */
+ export async function summarizeGitHubRepo(repoUrl: string): Promise<RepoSummary> {
+   try {
+     // Fetch README content from our API endpoint
+     const response = await fetch("/api/github-summariser", {
+       method: "POST",
+       headers: {
+         "Content-Type": "application/json",
+       },
+       body: JSON.stringify({ githubUrl: repoUrl }),
+     });
+ 
+     if (!response.ok) {
+       throw new Error(`Failed to fetch README: ${response.statusText}`);
+     }
+ 
+     const { readme } = await response.json();
+     
+     // Use the helper function to analyze the README content
+     return await analyzeReadmeContent(readme);
    } catch (error) {
      console.error("Error summarizing GitHub repo:", error);
```

---

_****_



Now I'll update the API endpoint to use the new `analyzeReadmeContent` function:

---

_****_



---

_****_



---



---

