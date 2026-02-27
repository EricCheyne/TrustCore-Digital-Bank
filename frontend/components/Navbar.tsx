import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#333', color: 'white' }}>
      <div>
        <Link href="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none', fontWeight: 'bold' }}>TrustCore Bank</Link>
        {user && (
          <>
            <Link href="/dashboard" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Dashboard</Link>
            <Link href="/transfer" style={{ color: 'white', textDecoration: 'none' }}>Transfer</Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <button onClick={logout} style={{ background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        ) : (
          <>
            <Link href="/login" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Login</Link>
            <Link href="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
