import React, { useState } from 'react';
import axios from 'axios';
import './TransactionList.css';

const API_BASE = 'http://127.0.0.1:8000';

const TransactionList = ({ transactions, onEdit }) => {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ type: '', amount: '', description: '', created_at: '' });
  const [message, setMessage] = useState('');

  const startEdit = (tx) => {
    setEditId(tx.id);
    setEditData({ type: tx.type, amount: tx.amount, description: tx.description, created_at: tx.created_at ? tx.created_at.slice(0, 10) : '' });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    await axios.put(`${API_BASE}/transactions/${id}`, editData);
    setEditId(null);
    setMessage('Transaction updated!');
    if (onEdit) onEdit();
    setTimeout(() => setMessage(''), 2000);
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div style={{ marginBottom: 24 }}>
      <h3>Transactions</h3>
      {message && <div style={{ color: 'green', marginBottom: 8 }}>{message}</div>}
      <table className="transactions-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map(tx => (
            <tr key={tx.id} className={editId === tx.id ? 'editing' : ''}>
              <td>
                {editId === tx.id ? (
                  <select name="type" value={editData.type} onChange={handleEditChange}>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                ) : tx.type}
              </td>
              <td>
                {editId === tx.id ? (
                  <input name="amount" type="number" value={editData.amount} onChange={handleEditChange} min="0.01" step="0.01" />
                ) : tx.amount.toFixed(2)}
              </td>
              <td>
                {editId === tx.id ? (
                  <input name="description" type="text" value={editData.description} onChange={handleEditChange} />
                ) : tx.description}
              </td>
              <td>{editId === tx.id ? (
                <input name="created_at" type="date" value={editData.created_at} onChange={handleEditChange} />
              ) : (tx.created_at ? new Date(tx.created_at).toLocaleDateString() : '')}</td>
              <td>
                {editId === tx.id ? (
                  <>
                    <button onClick={() => saveEdit(tx.id)} className="action-btn save">Save</button>
                    <button onClick={() => setEditId(null)} className="action-btn cancel">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(tx)} className="action-btn">Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;