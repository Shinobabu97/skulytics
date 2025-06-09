import { useState } from 'react'
import axios from 'axios'

interface FileUploadProps {
  onDataLoaded: () => void
}

const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setError('')
    } else {
      setFile(null)
      setError('Bitte wählen Sie eine gültige CSV-Datei aus')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.message === 'File uploaded successfully') {
        onDataLoaded()
        setFile(null)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Fehler beim Hochladen der Datei')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-2 ml-4">
      <label className="text-sm text-gray-700 font-medium whitespace-nowrap">
        CSV hochladen:
      </label>
      <input
        id="file-upload-navbar"
        name="file-upload-navbar"
        type="file"
        accept=".csv"
        className="block w-auto text-sm text-gray-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? 'Lädt...' : 'Hochladen'}
      </button>
      {error && (
        <span className="ml-2 text-xs text-red-600">{error}</span>
      )}
      {file && !error && (
        <span className="ml-2 text-xs text-gray-500">{file.name}</span>
      )}
    </div>
  )
}

export default FileUpload 