import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function TransferPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      api.get('/banking/api/v1/banking/accounts')
        .then(res => setAccounts(res.data))
        .catch(console.error);
    }
  }, [user]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await api.post('/banking/api/v1/banking/transfer', {
        fromAccountNumber: fromAccount,
        toAccountNumber: toAccount,
        amount: parseFloat(amount),
        description
      });
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed');
    }
  };

  if (!user) return <p>Please login.</p>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
        <h1>Transfer Money</h1>
        <form onSubmit={handleTransfer}>
          <div style={{ marginBottom: '15px' }}>
            <label>From Account</label><br/>
            <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
              <option value="">Select account</option>
              {accounts.map(acc => (
                <option key={acc.accountNumber} value={acc.accountNumber}>{acc.accountNumber} ({acc.balance} {acc.currency})</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>To Account Number</label><br/>
            <input type="text" value={toAccount} onChange={(e) => setToAccount(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Amount</label><br/>
            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Description</label><br/>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>Transfer successful! Redirecting...</p>}
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
            Send Money
          </button>
        </form>
      </div>
    </div>
  );
}
