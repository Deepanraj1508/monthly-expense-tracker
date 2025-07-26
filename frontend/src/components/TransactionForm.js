import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionForm.css';

const API_BASE = 'http://127.0.0.1:8000';


const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const TransactionForm = ({ onAdd }) => {
  const [type, setType] = useState('credit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getToday());
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/descriptions/`).then(res => setSuggestions(res.data));
  }, []);

  const filteredSuggestions = description
    ? suggestions.filter(d => d && d.toLowerCase().includes(description.toLowerCase()) && d !== description)
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    onAdd({ type, amount: parseFloat(amount), description, created_at: date });
    setAmount('');
    setDescription('');
    setDate(getToday());
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (s) => {
    setDescription(s);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form" autoComplete="off">
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="credit">Credit</option>
        <option value="debit">Debit</option>
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
        min="0.01"
        step="0.01"
      />
      <div style={{ display: 'inline-block', position: 'relative'}}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          // style={{ width: '100%' }}
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {filteredSuggestions.map((s, i) => (
              <li
                key={i}
                onMouseDown={() => handleSuggestionClick(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default TransactionForm;