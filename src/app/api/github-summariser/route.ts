import { NextResponse } from 'next/server';
import { getRepository } from '@/lib/database/repository-factory';

export async function POST(request: Request) {
  try {
    // Extract API key from headers and repo URL from body
    const apiKey = request.headers.get('x-api-key');
    console.log('Received request headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    console.log('Received request body:', body);
    
    const { githubUrl } = body;

    // Validate inputs
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required in x-api-key header' },
        { status: 401 }
      );
    }

    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub repository URL is required in request body' },
        { status: 400 }
      );
    }

    // Validate API key
    try {
      const repository = getRepository();
      const apiKeyData = await repository.getApiKeyByKey(apiKey);
      
      if (!apiKeyData) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('API key validation error:', error);
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Parse GitHub URL to get owner and repo
    try {
      // Clean and validate the URL
      const cleanUrl = githubUrl.trim().replace(/\/$/, ''); // Remove trailing slash
      if (!cleanUrl.startsWith('https://github.com/')) {
        return NextResponse.json(
          { error: 'URL must be a valid GitHub repository URL starting with https://github.com/' },
          { status: 400 }
        );
      }

      const urlObj = new URL(cleanUrl);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      // We need exactly owner and repo in the path
      if (pathParts.length < 2) {
        return NextResponse.json(
          { error: 'URL must point to a GitHub repository (format: https://github.com/owner/repo)' },
          { status: 400 }
        );
      }

      const [owner, repo] = pathParts;
      console.log('Extracted owner/repo:', { owner, repo });

      // First verify the repository exists
      const repoCheckUrl = `https://api.github.com/repos/${owner}/${repo}`;
      const repoResponse = await fetch(repoCheckUrl);
      
      if (!repoResponse.ok) {
        return NextResponse.json(
          { error: 'Repository not found. Please check if the repository exists and is public.' },
          { status: 404 }
        );
      }

      // If repository exists, try to fetch README
      const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
      const readmeResponse = await fetch(readmeUrl);

      if (!readmeResponse.ok) {
        // Try master branch if main branch doesn't exist
        const masterReadmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
        const masterReadmeResponse = await fetch(masterReadmeUrl);

        if (!masterReadmeResponse.ok) {
          return NextResponse.json(
            { error: 'README.md not found in repository. The repository exists but does not have a README.md file in the main or master branch.' },
            { status: 404 }
          );
        }

        const readme = await masterReadmeResponse.text();
        return NextResponse.json({ readme });
      }

      const readme = await readmeResponse.text();
      return NextResponse.json({ readme });

    } catch (error) {
      console.error('URL parsing error:', error);
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('GitHub summariser error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 