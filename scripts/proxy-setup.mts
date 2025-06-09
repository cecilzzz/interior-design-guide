import { ProxyAgent, fetch as undeciFetch } from 'undici';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

// Check if proxy is needed
const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.https_proxy;

let proxyAgentInstance: ProxyAgent | undefined;

if (proxyUrl) {
  console.log(`🌐 Using proxy: ${proxyUrl}`);
  
  // Create proxy agent
  proxyAgentInstance = new ProxyAgent(proxyUrl);
  
  // Override global fetch to use proxy
  (globalThis as any).fetch = (input: any, init?: any) => {
    return undeciFetch(input, {
      ...init,
      dispatcher: proxyAgentInstance
    });
  };
} else {
  console.log('🌐 No proxy settings detected, using direct connection');
  
  // If no proxy, use undici fetch (more stable than native fetch)
  (globalThis as any).fetch = undeciFetch;
}

export { proxyAgentInstance as proxyAgent }; 