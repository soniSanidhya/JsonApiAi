import React, { useState } from 'react';
import { Send, Database, ArrowRight, MessageSquare , Copy, CopyCheck } from 'lucide-react';

function App() {
  const [endpoint, setEndpoint] = useState({
    path: '',
    method: 'GET',
    query: ''
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://json-api-ai.vercel.app${endpoint.path}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    },5000 )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create endpoint
      const createRes = await fetch('https://json-api-ai.vercel.app/add-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(endpoint),
      });

      if (!createRes.ok) throw new Error('Failed to create endpoint');

      // Fetch new endpoint data
      const fetchRes = await fetch(`https://json-api-ai.vercel.app${endpoint.path}`);

      const data = await fetchRes.json();
      
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Neon glow effects */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000_100%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-purple-500/20 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[20%] w-64 h-64 bg-blue-500/20 rounded-full filter blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              JSON Endpoint Generator
            </h1>
            <p className="text-gray-400">Create dynamic JSON endpoints with AI-powered responses</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700/50">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Endpoint Path
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={endpoint.path}
                  onChange={(e) => setEndpoint({ ...endpoint, path: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="/api/your-endpoint"
                />
                <Database className="absolute right-3 top-2.5 text-gray-500 h-5 w-5" />
              </div>
            </div>

            

            <div>
              <label className=" text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Natural Language Query
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={endpoint.query || ''}
                  onChange={(e) => setEndpoint({ ...endpoint, query: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder='Enter your query (e.g., "10 best food items")'
                />
                <p className="text-xs text-gray-400">
                  Enter a natural language query like "10 best food items" or "list of popular movies"
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Generate Endpoint</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

          

          {response && (

            <div className="mt-6 bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-4">
                <ArrowRight className="h-5 w-5 text-green-400" />
                <h3 className="text-xl font-medium text-green-400">Generated Endpoint</h3>
              </div>
              <div className="flex justify-between items-center bg-gray-900 space-x-2 mb-4 p-4 rounded-lg">
                <div className="">
                https://json-api-ai.vercel.app{endpoint.path}
                </div>
                <div onClick={handleCopy} className="">
                {copied ?
                <CopyCheck className="h-5 w-5 cursor-pointer "/>:
                  <Copy className="h-5 w-5 cursor-pointer "/>
                }
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                <pre className="whitespace-pre-wrap break-words text-gray-300">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;