import React, { useState } from 'react';
import './BankStatement.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BankStatement = ({ transactions, initialBalance = 0 }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');

  // Filter transactions by date range or month
  let filtered = [...transactions];
  if (month) {
    filtered = filtered.filter(tx => {
      const d = new Date(tx.created_at);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return m === month;
    });
  } else if (startDate && endDate) {
    filtered = filtered.filter(tx => {
      const d = new Date(tx.created_at);
      return d >= new Date(startDate) && d <= new Date(endDate);
    });
  }

  // Transactions in ascending order (oldest first)
  const sorted = filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  let runningBalance = initialBalance;
  let totalCredit = 0;
  let totalDebit = 0;

  const rows = sorted.map((tx, idx) => {
    const credit = tx.type === 'credit' ? tx.amount : '';
    const debit = tx.type === 'debit' ? tx.amount : '';
    if (tx.type === 'credit') {
      runningBalance += tx.amount;
      totalCredit += tx.amount;
    } else {
      runningBalance -= tx.amount;
      totalDebit += tx.amount;
    }
    return [
      tx.created_at ? new Date(tx.created_at).toLocaleDateString() : '',
      tx.description,
      credit ? credit.toFixed(2) : '',
      debit ? debit.toFixed(2) : '',
      runningBalance.toFixed(2)
    ];
  });

  // PDF download handler
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Bank Statement', 14, 16);
    autoTable(doc, {
      head: [['Date', 'Description', 'Credit', 'Debit', 'Balance']],
      body: rows,
      startY: 24
    });
    let fileName = 'Monthly_Statement.pdf';
    if (month) {
      const [y, m] = month.split('-');
      fileName = `Monthly_Statement_${y}_${m}.pdf`;
    } else if (startDate && endDate) {
      fileName = `Monthly_Statement_${startDate}_to_${endDate}.pdf`;
    }
    doc.save(fileName);
  };

  return (
    <div className="bank-statement-page">
      <div className="bank-statement-filters">
        <div>
          <label>Date Range:</label><br />
          <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setMonth(''); }} />
          {' '}to{' '}
          <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setMonth(''); }} />
        </div>
        <div>
          <label>Month:</label><br />
          <input type="month" value={month} onChange={e => { setMonth(e.target.value); setStartDate(''); setEndDate(''); }} />
        </div>
        <button onClick={handleDownloadPDF}>Download PDF</button>
      </div>
      <table className="bank-statement-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Credit</th>
            <th>Debit</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, i) => <td key={i}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}><b>Totals</b></td>
            <td><b>{totalCredit.toFixed(2)}</b></td>
            <td><b>{totalDebit.toFixed(2)}</b></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default BankStatement;