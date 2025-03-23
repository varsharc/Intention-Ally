// This file serves as an entry point to the Intention-Ally components
// It exports the major UI components used in the application

export const Layout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span className="text-xl font-bold text-yellow-500">Intention-Ally</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white">Dashboard</a>
            <a href="#" className="text-gray-300 hover:text-white">Search</a>
            <a href="#" className="text-gray-300 hover:text-white">Analytics</a>
            <a href="#" className="text-gray-300 hover:text-white">Settings</a>
          </nav>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-4">
        {/* Content would go here */}
      </main>
      
      <footer className="bg-black p-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>Intention-Ally © 2025 | Semantic Search & Clustering Tool</p>
        </div>
      </footer>
    </div>
  )
}

export const SearchBar = () => {
  return (
    <div className="mb-6">
      <div className="flex">
        <input
          type="text"
          placeholder="Enter keyword to track..."
          className="flex-1 p-2 bg-gray-800 border border-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-r-md transition-colors">
          Search
        </button>
      </div>
    </div>
  )
}

export const KeywordTags = ({ keywords = ["carbon insetting", "sustainable logistics", "scope 3 emissions"] }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {keywords.map((keyword, index) => (
        <div key={index} className="bg-yellow-500 bg-opacity-20 text-yellow-500 px-3 py-1 rounded-md flex items-center">
          {keyword}
          <button className="ml-2 text-yellow-500 hover:text-yellow-300">×</button>
        </div>
      ))}
    </div>
  )
}

export const KnowledgeGraph = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Knowledge Graph</h2>
        <div className="flex gap-2">
          <button className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">Zoom In</button>
          <button className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">Zoom Out</button>
        </div>
      </div>
      <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-700 rounded">
        Knowledge Graph Visualization
      </div>
    </div>
  )
}

export const TrendVisualization = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Trend Analysis</h2>
        <select className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 text-sm">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-700 rounded">
        Trend Line Visualization
      </div>
    </div>
  )
}

export const SearchResults = () => {
  const results = [
    {
      id: 1,
      title: "What is Carbon Insetting? Greener Logistics Starts Here",
      url: "sustainablelogistics.com/carbon-insetting",
      description: "Carbon insetting is the practice of making investments in sustainable practices directly within a company's own supply chain..."
    },
    {
      id: 2,
      title: "Carbon Insetting vs Offsetting: The Key Differences Explained",
      url: "climateaction.org/insights/insetting-vs-offsetting",
      description: "While carbon offsetting focuses on compensating for emissions by funding external projects, carbon insetting aims to reduce emissions directly within your value chain..."
    },
    {
      id: 3,
      title: "Implementing Carbon Insetting in Logistics Networks",
      url: "logisticsweekly.com/carbon-strategies",
      description: "Organizations are increasingly turning to carbon insetting as a strategy to reduce emissions throughout their logistics and supply chain operations..."
    }
  ];
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Search Results</h2>
        <div className="flex gap-2">
          <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Sort</button>
          <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Filter</button>
        </div>
      </div>
      <div className="space-y-4">
        {results.map(result => (
          <div key={result.id} className="bg-gray-900 p-4 rounded-md border-l-4 border-yellow-500">
            <h3 className="text-yellow-500 font-medium mb-1">{result.title}</h3>
            <div className="text-gray-400 text-sm mb-2">{result.url}</div>
            <p className="text-gray-300 text-sm">{result.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Sidebar = () => {
  return (
    <div className="fixed top-0 right-0 h-full w-64 bg-black border-l border-gray-800 p-4 shadow-xl transform translate-x-full transition-transform">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
        <h2 className="font-bold">Advanced Filters</h2>
        <button className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="mb-4">
        <h3 className="text-yellow-500 font-medium mb-2">Date Range</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm text-gray-400 mb-1">From</label>
            <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded p-1 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">To</label>
            <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded p-1 text-sm" />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-yellow-500 font-medium mb-2">Sources</h3>
        <div className="space-y-1">
          <div className="flex items-center">
            <input type="checkbox" id="source-news" className="mr-2" />
            <label htmlFor="source-news" className="text-sm">News Outlets</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="source-academic" className="mr-2" />
            <label htmlFor="source-academic" className="text-sm">Academic Papers</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="source-blogs" className="mr-2" />
            <label htmlFor="source-blogs" className="text-sm">Blogs & Forums</label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-yellow-500 font-medium mb-2">Content Type</h3>
        <div className="space-y-1">
          <div className="flex items-center">
            <input type="checkbox" id="type-article" className="mr-2" />
            <label htmlFor="type-article" className="text-sm">Articles</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="type-research" className="mr-2" />
            <label htmlFor="type-research" className="text-sm">Research</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="type-case" className="mr-2" />
            <label htmlFor="type-case" className="text-sm">Case Studies</label>
          </div>
        </div>
      </div>
    </div>
  )
}

// Default export for easy importing
export default {
  Layout,
  SearchBar,
  KeywordTags,
  KnowledgeGraph,
  TrendVisualization,
  SearchResults,
  Sidebar
};