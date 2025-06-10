import { useState, useEffect } from 'react'
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

interface ForecastData {
  SKU: string
  Name: string
  forecast: Array<{
    date: string
    value: number
  }>
}

interface ForecastProps {
  dataLoaded: number
}

const Forecast = ({ dataLoaded }: ForecastProps) => {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [salesRes, forecastRes] = await Promise.all([
          axios.get('/api/sales-history'),
          axios.get('/api/forecast'),
        ])
        setSalesData(salesRes.data)
        setForecastData(forecastRes.data)
        if (salesRes.data.length > 0) {
          setSelectedProducts(salesRes.data.slice(0, 2).map((product: SalesData) => product.SKU))
        }
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('No data uploaded yet. Please upload a CSV file.')
        } else {
          setError('Failed to fetch sales or forecast data')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dataLoaded])

  const handleProductSelection = (sku: string) => {
    setSelectedProducts(prev =>
      prev.includes(sku)
        ? prev.filter(p => p !== sku)
        : [...prev, sku]
    )
  }

  // Prepare chart data: combine last 12 months of sales and next 12 months of forecast
  const prepareChartData = () => {
    if (selectedProducts.length === 0) return []
    // Get all dates (last 12 months + next 12 months)
    const productSales = salesData.find(p => p.SKU === selectedProducts[0])
    const productForecast = forecastData.find(p => p.SKU === selectedProducts[0])
    if (!productSales || !productForecast) return []
    const last12 = productSales.sales.slice(-12)
    const next12 = productForecast.forecast.slice(0, 12)
    const allDates = [...last12.map(s => s.date), ...next12.map(f => f.date)]
    // Build chart data for all selected products
    return allDates.map(date => {
      const dataPoint: any = { date }
      selectedProducts.forEach(sku => {
        const sales = salesData.find(p => p.SKU === sku)
        const forecast = forecastData.find(p => p.SKU === sku)
        const salesVal = sales?.sales.find(s => s.date === date)?.value
        const forecastVal = forecast?.forecast.find(f => f.date === date)?.value
        if (salesVal !== undefined) dataPoint[`${sales.Name}_history`] = salesVal
        if (forecastVal !== undefined) dataPoint[`${forecast.Name}_forecast`] = forecastVal
      })
      return dataPoint
    })
  }

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-600">{error}</div>

  const chartData = prepareChartData()
  const colors = ['#2563eb', '#16a34a', '#f59e42', '#e11d48', '#7c3aed']
  const forecastColors = ['#dc2626', '#ea580c', '#fbbf24', '#be185d', '#0ea5e9']

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Sales Forecast</h1>
          <p className="mt-2 text-sm text-gray-700">
            Die Prognose basiert ausschließlich auf dem letzten Monat der Verkaufszahlen und einer konstanten Wachstumsrate von 50% pro Monat. Es werden keine saisonalen Anpassungen oder externen Einflussfaktoren berücksichtigt.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {salesData.map((product) => (
            <button
              key={product.SKU}
              onClick={() => handleProductSelection(product.SKU)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedProducts.includes(product.SKU)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {product.Name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedProducts.map((sku, index) => {
              const sales = salesData.find(p => p.SKU === sku)
              const forecast = forecastData.find(p => p.SKU === sku)
              return [
                <Line
                  key={`${sku}_history`}
                  type="monotone"
                  dataKey={`${sales?.Name}_history`}
                  stroke={colors[index % colors.length]}
                  dot={false}
                  name={`${sales?.Name} (Historie)`}
                />,
                <Line
                  key={`${sku}_forecast`}
                  type="monotone"
                  dataKey={`${forecast?.Name}_forecast`}
                  stroke={forecastColors[index % forecastColors.length]}
                  strokeDasharray="5 5"
                  dot={false}
                  name={`${forecast?.Name} (Forecast)`}
                />
              ]
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-medium text-gray-900">Forecast Methodology</h2>
        <p className="mt-2 text-sm text-gray-700">
          Die Prognose basiert auf folgenden Annahmen:
        </p>
        <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
          <li>Nur der letzte Monat der Verkaufszahlen wird als Basis verwendet</li>
          <li>Konstante Wachstumsrate von 50% pro Monat</li>
          <li>Keine saisonalen Anpassungen</li>
          <li>Keine Berücksichtigung externer Einflussfaktoren</li>
        </ul>
      </div>
    </div>
  )
}

export default Forecast 
