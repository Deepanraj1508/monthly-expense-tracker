import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import './PieChartCreditDebit.css';

const CHART1_COLORS = ['#4caf50', '#f44336'];
const CHART2_COLORS = ['#abb429ff', '#f44336', '#ff9800', '#2196f3', '#9c27b0','#17df42ff','#b07027ff','#b05e27ff'];


const PieChartCreditDebit = ({ transactions }) => {
  let totalCredit = 0;
  let totalDebit = 0;
  transactions.forEach(tx => {
    if (tx.type === 'credit') totalCredit += tx.amount;
    else totalDebit += tx.amount;
  });
  const data = [
    { name: 'Credit', value: totalCredit },
    { name: 'Debit', value: totalDebit },
  ];

  const frequentTransactions = transactions.reduce((acc, tx) => {
    acc[tx.description] = (acc[tx.description] || 0) + 1;
    return acc;
  }, {});

  const frequentData2 = Object.entries(frequentTransactions)
    .filter(([_, count]) => count >= 2)
    .map(([name, count]) => ({ name, value: count }));

  const frequentData3 = Object.entries(frequentTransactions)
    .filter(([_, count]) => count >= 3)
    .map(([name, count]) => ({ name, value: count }));

  return (
    <div className="piechart-container">
      <div className='inside-piechart-container'>
      <h3 style={{ fontSize: '1.8em', fontWeight: '600', color: '#333'}}>Credit vs Debit</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART1_COLORS[index % CHART1_COLORS.length]} />
            ))}
          </Pie>
          
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      </div>
      
      <div className='inside-piechart-container'>
      <h3 style={{ fontSize: '1.8em', fontWeight: '600', color: '#333'}}>Frequent 2+ Transactions</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={frequentData2} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
            {frequentData2.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART2_COLORS[index % CHART2_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      </div>
      <div className='inside-piechart-container'>
      <h3 style={{ fontSize: '1.8em', fontWeight: '600', color: '#333'}}>Frequent 3+ Transactions</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={frequentData3} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
            {frequentData3.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART2_COLORS[index % CHART2_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartCreditDebit;