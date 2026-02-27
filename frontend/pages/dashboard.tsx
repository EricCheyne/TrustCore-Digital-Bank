import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/banking/api/v1/banking/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const createAccount = async () => {
    try {
      await api.post('/banking/api/v1/banking/accounts', { currency: 'USD' });
      fetchAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || (user && fetching)) return <p>Loading...</p>;
  if (!user) return <p>Please <Link href="/login">login</Link> to view dashboard.</p>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Dashboard</h1>
        <button onClick={createAccount} style={{ marginBottom: '20px', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          Create New Account
        </button>
        
        {accounts.length === 0 ? (
          <p>No accounts found. Create one to get started!</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {accounts.map(acc => (
              <div key={acc.accountNumber} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h3>{acc.accountNumber}</h3>
                <p>Balance: <strong>{acc.balance} {acc.currency}</strong></p>
                <Link href={`/transactions/${acc.accountNumber}`}>View History</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
