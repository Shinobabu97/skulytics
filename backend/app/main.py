from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from datetime import datetime
from dateutil.relativedelta import relativedelta
import io

# All routes are served under this prefix so the frontend can proxy them easily
API_PREFIX = "/api"

# Initialize FastAPI application
app = FastAPI(title="SKUlytics API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for the uploaded CSV data.
# In a production setting this would be replaced by a database.
current_data = None


@app.post(f"{API_PREFIX}/upload")
async def upload_file(file: UploadFile = File(...)):
    """Receive a CSV file and store its contents in memory."""
    global current_data

    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400, detail="Only CSV files are allowed")

    try:
        # Read the file content as bytes
        content = file.file.read()
        try:
            # Try reading as UTF-8
            df = pd.read_csv(io.BytesIO(content), encoding='utf-8')
        except UnicodeDecodeError:
            # Fallback to latin1
            df = pd.read_csv(io.BytesIO(content), encoding='latin1')

        # Validate required columns
        required_columns = ['SKU', 'Name', 'Beschreibung',
                            'Preis', 'Kategorie', 'Lagerbestand']
        missing_columns = [
            col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_columns)}"
            )

        # Validate date columns (should be at least 24 months)
        date_columns = [col for col in df.columns if col.startswith('20')]
        if len(date_columns) < 24:
            raise HTTPException(
                status_code=400,
                detail="CSV must contain at least 24 months of sales data"
            )

        # Store the data
        current_data = df.to_dict(orient='records')

        return {"message": "File uploaded successfully", "rows": len(current_data)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(f"{API_PREFIX}/products")
async def get_products():
    """Return the raw product records from the uploaded CSV."""
    if current_data is None:
        raise HTTPException(status_code=404, detail="No data uploaded yet")

    return current_data


@app.get(f"{API_PREFIX}/sales-history")
async def get_sales_history():
    """Return monthly sales history for each product."""
    if current_data is None:
        raise HTTPException(status_code=404, detail="No data uploaded yet")

    # Convert the data back to DataFrame for easier manipulation
    df = pd.DataFrame(current_data)

    # Get date columns
    date_columns = [col for col in df.columns if col.startswith('20')]

    # Prepare the response
    sales_data = []
    for _, row in df.iterrows():
        product_sales = {
            "SKU": row['SKU'],
            "Name": row['Name'],
            "sales": [{"date": date, "value": float(row[date])} for date in date_columns]
        }
        sales_data.append(product_sales)

    return sales_data


@app.get(f"{API_PREFIX}/forecast")
async def get_forecast():
    """Generate a naive 12 month sales forecast for each product."""
    if current_data is None:
        raise HTTPException(status_code=404, detail="No data uploaded yet")

    # Convert the data back to DataFrame
    df = pd.DataFrame(current_data)

    # Get the date columns
    date_columns = [col for col in df.columns if col.startswith('20')]
    last_month = date_columns[-1]

    forecast_data = []
    for _, row in df.iterrows():
        # Use only the last month's sales as the base
        last_value = float(row[last_month])

        # Generate forecast for next 12 months (50% growth)
        forecast = []
        current_date = datetime.strptime(last_month, '%Y-%m')
        for i in range(12):
            current_date += relativedelta(months=1)
            forecast_date = current_date.strftime('%Y-%m')
            forecast_value = last_value * \
                (1.5 ** (i + 1))  # 50% growth per month
            forecast.append({
                "date": forecast_date,
                "value": round(forecast_value, 2)
            })

        forecast_data.append({
            "SKU": row['SKU'],
            "Name": row['Name'],
            "forecast": forecast
        })

    return forecast_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
