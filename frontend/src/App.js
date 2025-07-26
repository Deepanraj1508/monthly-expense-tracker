import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BankStatement from './components/BankStatement';
import PieChartCreditDebit from './components/PieChartCreditDebit';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:8000';

function Dashboard({ transactions, balance, loading, onAdd, onEdit }) {
  return (
    
    <div className="dashboard" style={{ display: 'flex', flexDirection: 'row', gap: 32, alignItems: 'flex-start' }}>
      
      <div style={{ flex: 1 }}>
        <h1>Expense Tracker</h1>
        
        <TransactionForm onAdd={onAdd} />
      </div>
      <div style={{ flex: 2 }}>
        {loading ? <p>Loading...</p> : <TransactionList transactions={transactions} onEdit={onEdit} />}
      </div>
    </div>
  );
}



function PieChartPage({ transactions }) {
  return (
    <div className="piechart-page">
      <PieChartCreditDebit transactions={transactions} />
    </div>
  );
}

function BankStatementPage({ transactions }) {
  return (
    <div className="bankstatement-page">
      <BankStatement transactions={transactions} initialBalance={0} />
    </div>
  );
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [txRes, balRes] = await Promise.all([
      axios.get(`${API_BASE}/transactions/`),
      axios.get(`${API_BASE}/balance/`)
    ]);
    setTransactions(txRes.data);
    setBalance(balRes.data.balance);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (tx) => {
    await axios.post(`${API_BASE}/transactions/`, tx);
    fetchData();
  };

  return (
    <Router>
      <nav style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        <Link to="/">Dashboard</Link>
        <Link to="/piechart">Pie Chart</Link>
        <Link to="/bank-statement">Bank Statement</Link>
      </nav>
      <div className="App" style={{ margin: '0 auto', padding: 24 }}>
        <h2 className='available_balance'>Balance: ₹{balance.toFixed(2)}</h2>
        <Routes>
          <Route path="/" element={<Dashboard transactions={transactions} balance={balance} loading={loading} onAdd={handleAdd} onEdit={fetchData} />} />
          <Route path="/piechart" element={<PieChartPage transactions={transactions} />} />
          <Route path="/bank-statement" element={<BankStatementPage transactions={transactions} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
