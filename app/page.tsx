// app/page.tsx - Landing Page
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="font-bold text-black">A</span>
            </div>
            <h1 className="text-xl font-bold text-white">Intention-Ally</h1>
          </div>
          <div>
            <Link href="/login">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Discover What Really Matters
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Intention-Ally helps you track specialized topics across the internet with
            AI-powered filtering, authority scoring, and semantic clustering.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/signup">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-3 rounded-md w-full sm:w-auto">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md border border-gray-700 w-full sm:w-auto">
                Sign In
              </button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-3">Quality Over Quantity</h2>
            <p className="text-gray-400">
              Our authority scoring system prioritizes reliable sources, ensuring you discover
              information you can trust.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-3">Semantic Connections</h2>
            <p className="text-gray-400">
              Discover meaningful relationships between information sources with our 
              interactive knowledge graph visualization.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-3">AI-Powered Research</h2>
            <p className="text-gray-400">
              Leverage Claude AI for deep research and insights, helping you understand
              complex topics more efficiently.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-black py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 Intention-Ally. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}