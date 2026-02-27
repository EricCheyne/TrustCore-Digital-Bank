import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Welcome to TrustCore Digital Bank</h1>
        <p>Your secure and modern banking platform.</p>
        <div style={{ marginTop: '20px' }}>
          <Link href="/register" style={{ padding: '10px 20px', background: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '4px', marginRight: '10px' }}>
            Get Started
          </Link>
          <Link href="/login" style={{ padding: '10px 20px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
