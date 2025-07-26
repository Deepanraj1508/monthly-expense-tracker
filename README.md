# Expense Tracker Backend

## Setup

1. Create and activate a virtual environment:
   ```
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the FastAPI server:
   ```
   uvicorn Expense_Tracker.main:app --reload
   ```

## API Endpoints

- `GET /` — Health check
- `POST /transactions/` — Add a credit or debit transaction
- `GET /transactions/` — List all transactions
- `GET /balance/` — Get the current available balance

## Next Steps

- Frontend (React) setup
- Usage graph API
