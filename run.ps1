# Start the backend server
Start-Process powershell -ArgumentList "cd backend; python -m venv venv; .\venv\Scripts\activate; pip install -r requirements.txt; uvicorn app.main:app --reload"

# Start the frontend server
Start-Process powershell -ArgumentList "cd frontend; npm install; npm run dev" 