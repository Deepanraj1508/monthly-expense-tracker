import React, { useState } from 'react';
import './BankStatement.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BankStatement = ({ transactions, initialBalance = 0 }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter transactions by date range, month, or description
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

  if (descriptionFilter) {
    filtered = filtered.filter(tx => tx.description.toLowerCase().includes(descriptionFilter.toLowerCase()));
  }

  // Transactions in ascending order (oldest first)
  const sorted = filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedTransactions = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  let runningBalance = initialBalance;
  let totalCredit = 0;
  let totalDebit = 0;

  const rows = paginatedTransactions.map((tx, idx) => {
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
        <div>
          <label>Description:</label><br />
          <input type="text" placeholder="Search by description" value={descriptionFilter} onChange={e => setDescriptionFilter(e.target.value)} />
        </div>
        <button onClick={handleDownloadPDF}>Download PDF</button>
      </div>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="pagination-btn">Previous</button>
        <div className="pagination-info">
          <span>Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
          <span style={{ marginLeft: '10px' }}>Total Records: <strong>{sorted.length}</strong></span>
        </div>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-btn">Next</button>
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