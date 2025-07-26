from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    data = transaction.dict()
    if not data.get('created_at'):
        data['created_at'] = datetime.now()
    db_transaction = models.Transaction(**data)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Transaction).order_by(models.Transaction.created_at.desc()).offset(skip).limit(limit).all()

def get_balance(db: Session):
    credits = db.query(models.Transaction).filter(models.Transaction.type == 'credit').with_entities(models.Transaction.amount)
    debits = db.query(models.Transaction).filter(models.Transaction.type == 'debit').with_entities(models.Transaction.amount)
    total_credit = sum([c.amount for c in credits])
    total_debit = sum([d.amount for d in debits])
    return total_credit - total_debit 

def get_unique_descriptions(db: Session):
    return [row[0] for row in db.query(models.Transaction.description).distinct().filter(models.Transaction.description != None).all()] 

def update_transaction(db: Session, transaction_id: int, transaction: schemas.TransactionCreate):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_transaction:
        return None
    db_transaction.type = transaction.type
    db_transaction.amount = transaction.amount
    db_transaction.description = transaction.description
    if transaction.created_at:
        db_transaction.created_at = transaction.created_at
    db.commit()
    db.refresh(db_transaction)
    return db_transaction