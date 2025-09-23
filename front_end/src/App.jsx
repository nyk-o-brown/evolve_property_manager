import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            React + Tailwind
          </h1>
          <p className="text-xl text-gray-600">
            Beautiful, modern UI with Tailwind CSS
          </p>
        </div>

        {/* Logos */}
        <div className="flex justify-center items-center gap-8 mb-12">
          <a 
            href="https://vite.dev" 
            target="_blank" 
            className="group hover:scale-110 transition-transform duration-300"
          >
            <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
            <p className="text-sm text-gray-600 mt-2 group-hover:text-blue-600 transition-colors">
              Vite
            </p>
          </a>
          <a 
            href="https://react.dev" 
            target="_blank"
            className="group hover:scale-110 transition-transform duration-300"
          >
            <img src={reactLogo} className="h-24 w-24 animate-spin-slow" alt="React logo" />
            <p className="text-sm text-gray-600 mt-2 group-hover:text-blue-600 transition-colors">
              React
            </p>
          </a>
        </div>

        {/* Counter Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Interactive Counter
          </h2>
          <div className="text-6xl font-bold text-blue-600 mb-6">
            {count}
          </div>
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Increment
          </button>
        </div>

        {/* Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-gray-700 mb-4">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">src/App.jsx</code> and save to test Hot Module Replacement (HMR)
          </p>
          <p className="text-gray-600 text-sm">
            This app is built with Vite, React, and Tailwind CSS for a modern development experience.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
