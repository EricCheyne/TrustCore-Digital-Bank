import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function TransactionHistoryPage() {
  const router = useRouter();
  const { accountNumber } = router.query;
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && accountNumber) {
      api.get(`/banking/api/v1/banking/accounts/${accountNumber}/transactions`)
        .then(res => setTransactions(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, accountNumber]);

  if (!user) return <p>Please login.</p>;
  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Transaction History: {accountNumber}</h1>
        {transactions.length === 0 ? (
          <p>No transactions found for this account.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>From</th>
                <th style={{ padding: '10px' }}>To</th>
                <th style={{ padding: '10px' }}>Description</th>
                <th style={{ padding: '10px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td style={{ padding: '10px' }}>{tx.fromAccountNumber}</td>
                  <td style={{ padding: '10px' }}>{tx.toAccountNumber}</td>
                  <td style={{ padding: '10px' }}>{tx.description}</td>
                  <td style={{ padding: '10px', color: tx.toAccountNumber === accountNumber ? 'green' : 'red' }}>
                    {tx.toAccountNumber === accountNumber ? '+' : '-'}{tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
