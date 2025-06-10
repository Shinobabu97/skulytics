import { useState, useEffect } from 'react'
import axios from 'axios'

interface Product {
  SKU: string
  Name: string
  Beschreibung: string
  Preis: number
  Kategorie: string
  Lagerbestand: number
}

interface ProductOverviewProps {
  dataLoaded: boolean
}

const ProductOverview = ({ dataLoaded }: ProductOverviewProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError('')
      if (!sessionStorage.getItem('dataUploaded')) {
        setLoading(false)
        setError('No data uploaded yet. Please upload a CSV file.')
        return
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`)
        setProducts(response.data)
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('No data uploaded yet. Please upload a CSV file.')
        } else {
          setError('Failed to fetch products')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [dataLoaded])

  const categories = [...new Set(products.map(product => product.Kategorie))]

  const filteredProducts = (products || []).filter(product => {
    if (!product) return false;
    const name = (product.Name || '').toLowerCase();
    const sku = (product.SKU !== undefined && product.SKU !== null)
      ? String(product.SKU).toLowerCase()
      : '';
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || sku.includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.Kategorie === selectedCategory;
    return matchesSearch && matchesCategory;
  })

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-600">{error}</div>

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Produktübersicht</h1>
          <p className="mt-2 text-sm text-gray-700">
            Eine Übersicht aller Produkte im Lager, inklusive SKU, Name, Preis, Kategorie und Lagerbestand.
          </p>
        </div>
      </div>

      <div className="mt-4 flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-48">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      SKU
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Beschreibung
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Preis
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Kategorie
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Lagerbestand
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredProducts.map((product) => (
                    <tr key={product.SKU}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {product.SKU}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.Name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.Beschreibung}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">€{product.Preis}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.Kategorie}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.Lagerbestand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductOverview 
