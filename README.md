# SKUlytics

A web application for analyzing and forecasting sales data based on a single CSV dataset.

## Features

- CSV file upload with validation
- Product overview with filtering and search
- Historical sales visualization
- Sales forecasting for the next 12 months
- Comprehensive documentation

## Tech Stack

### Frontend

- React with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API communication

### Backend

- FastAPI (Python)
- Pandas for data processing
- NumPy for mathematical operations

## Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- pip (Python package manager)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd skulytics
```

2. Set up the backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:

```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:

```bash
cd backend
uvicorn app.main:app --reload
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

### Automatic data reload

After a successful CSV upload, the frontend updates a `dataLoaded` timestamp in
`App.tsx`. This value is passed to the main pages so they refetch the latest
data without requiring a manual refresh.

3. Open your browser and navigate to `http://localhost:5173`

## CSV Data Format

The application expects a CSV file with the following structure:

```csv
SKU,Name,Beschreibung,Preis,Kategorie,Lagerbestand,2023-01,2023-02,...,2024-12
1001,Widget A,Standard Widget,19.99,Tools,120,15,20,...,22
```

Required columns:

- SKU: Product identifier
- Name: Product name
- Beschreibung: Product description
- Preis: Price
- Kategorie: Category
- Lagerbestand: Current stock
- Monthly sales columns (YYYY-MM format, minimum 24 months)

## API Endpoints

- `POST /upload`: Upload CSV file
- `GET /products`: Get all products
- `GET /sales-history`: Get historical sales data
- `GET /forecast`: Get sales forecast

## Development

### Backend Development

The backend is built with FastAPI and provides a RESTful API for the frontend. Key features:

- CSV file validation and processing
- In-memory data storage
- Sales forecasting based on historical data

### Frontend Development

The frontend is a React application with TypeScript. Key features:

- Modern, responsive UI with Tailwind CSS
- Interactive data visualization with Recharts
- Type-safe implementation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
