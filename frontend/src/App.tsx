import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ProductOverview from './components/ProductOverview'
import SalesHistory from './components/SalesHistory'
import Forecast from './components/Forecast'
import Documentation from './components/Documentation'
import FileUpload from './components/FileUpload'

function App() {
  const [dataLoaded, setDataLoaded] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16 items-center">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-800">SKUlytics</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Produktübersicht
                  </Link>
                  <Link
                    to="/sales"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Historische Verkäufe
                  </Link>
                  <Link
                    to="/forecast"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Forecast
                  </Link>
                  <Link
                    to="/docs"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dokumentation
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <FileUpload onDataLoaded={() => setDataLoaded(prev => !prev)} />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<ProductOverview dataLoaded={dataLoaded} />} />
            <Route path="/sales" element={<SalesHistory dataLoaded={dataLoaded} />} />
            <Route path="/forecast" element={<Forecast dataLoaded={dataLoaded} />} />
            <Route path="/docs" element={<Documentation />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App 
