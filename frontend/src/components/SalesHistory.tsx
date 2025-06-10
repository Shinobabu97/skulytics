import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface SalesData {
  SKU: string
  Name: string
  sales: Array<{
    date: string
    value: number
  }>
}

const TIME_FRAMES = [6, 12, 18, 24]

interface SalesHistoryProps {
  dataLoaded: number
}

const SalesHistory = ({ dataLoaded }: SalesHistoryProps) => {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [skuSearch, setSkuSearch] = useState('')
  const [timeFrame, setTimeFrame] = useState(24)
  const [showSkuPopover, setShowSkuPopover] = useState(false)
  const [tempSelected, setTempSelected] = useState<string[]>([])
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get('/api/sales-history')
        setSalesData(response.data)
        // Select first two products by default
        if (response.data.length > 0) {
          setSelectedProducts(response.data.slice(0, 2).map((product: SalesData) => product.SKU))
        }
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('No data uploaded yet. Please upload a CSV file.')
        } else {
          setError('Failed to fetch sales data')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchSalesData()
  }, [dataLoaded])

  // Handle outside click for popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowSkuPopover(false)
      }
    }
    if (showSkuPopover) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSkuPopover])

  // Filter SKUs by search
  const filteredSKUs = salesData.filter(product => {
    const search = skuSearch.toLowerCase()
    return (
      String(product.SKU).toLowerCase().includes(search) ||
      product.Name.toLowerCase().includes(search)
    )
  })

  // Prepare chart data for selected SKUs and time frame
  const prepareChartData = () => {
    if (!salesData.length || !selectedProducts.length) return []
    // Get all date columns (assume all products have the same dates)
    const allDates = salesData[0].sales.map(s => s.date)
    const dates = allDates.slice(-timeFrame)
    return dates.map(date => {
      const dataPoint: any = { date }
      salesData.forEach(product => {
        if (selectedProducts.includes(product.SKU)) {
          const sale = product.sales.find(s => s.date === date)
          dataPoint[product.Name] = sale?.value || 0
        }
      })
      return dataPoint
    })
  }

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-600">{error}</div>

  const chartData = prepareChartData()
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe']

  // Handlers for popover
  const openSkuPopover = () => {
    setTempSelected(selectedProducts)
    setShowSkuPopover(true)
    setSkuSearch('')
  }
  const handleTempSelect = (sku: string) => {
    setTempSelected(prev =>
      prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]
    )
  }
  const handleSkuOk = () => {
    setSelectedProducts(tempSelected)
    setShowSkuPopover(false)
  }
  const handleSkuCancel = () => {
    setShowSkuPopover(false)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Historische Verkäufe</h1>
            <p className="text-xs text-gray-600">Historische Verkaufsdaten für ausgewählte Produkte.</p>
          </div>
          <div className="flex gap-2 items-end h-full">
            {/* SKU Popover Filter */}
            <div className="relative flex flex-col justify-end">
              <label className="block text-xs font-medium text-gray-700 mb-0.5">SKU auswählen</label>
              <button
                className="w-40 text-xs px-2 py-1 rounded border border-gray-300 bg-white shadow-sm flex items-center justify-between"
                onClick={openSkuPopover}
                type="button"
              >
                {selectedProducts.length > 0
                  ? `${selectedProducts.length} SKU(s) ausgewählt`
                  : 'SKU auswählen'}
                <span className="ml-2 text-gray-400">▼</span>
              </button>
              {showSkuPopover && (
                <div
                  ref={popoverRef}
                  className="absolute right-0 z-10 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg p-2"
                >
                  <input
                    type="text"
                    placeholder="Suche SKU/Name..."
                    className="w-full text-xs px-2 py-1 rounded border-gray-300 mb-2"
                    value={skuSearch}
                    onChange={e => setSkuSearch(e.target.value)}
                  />
                  <div className="max-h-40 overflow-y-auto mb-2">
                    {filteredSKUs.map(product => (
                      <label key={product.SKU} className="flex items-center px-2 py-0.5 cursor-pointer hover:bg-indigo-50 text-xs">
                        <input
                          type="checkbox"
                          checked={tempSelected.includes(product.SKU)}
                          onChange={() => handleTempSelect(product.SKU)}
                          className="mr-1"
                        />
                        <span>{product.SKU} – {product.Name}</span>
                      </label>
                    ))}
                    {filteredSKUs.length === 0 && (
                      <div className="px-2 py-0.5 text-xs text-gray-400">Keine Treffer</div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                      onClick={handleSkuCancel}
                    >Abbrechen</button>
                    <button
                      className="text-xs px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                      onClick={handleSkuOk}
                    >OK</button>
                  </div>
                </div>
              )}
            </div>
            {/* Time Frame Select */}
            <div className="flex flex-col justify-end">
              <label className="block text-xs font-medium text-gray-700 mb-0.5">Zeitraum</label>
              <select
                className="w-20 text-xs px-2 py-1 rounded border-gray-300"
                value={timeFrame}
                onChange={e => setTimeFrame(Number(e.target.value))}
              >
                {TIME_FRAMES.map(tf => (
                  <option key={tf} value={tf}>{tf} Monate</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="h-[500px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedProducts.map((sku, index) => {
                const product = salesData.find(p => p.SKU === sku)
                return (
                  <Line
                    key={sku}
                    type="monotone"
                    dataKey={product?.Name}
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                  />
                )
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default SalesHistory 
