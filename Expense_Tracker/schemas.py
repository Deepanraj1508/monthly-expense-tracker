from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionBase(BaseModel):
    type: str  # 'credit' or 'debit'
    amount: float
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass
    created_at: Optional[datetime] = None

class Transaction(TransactionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True 