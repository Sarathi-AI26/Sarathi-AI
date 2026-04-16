import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ padding: '20px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        <Link href="/">SARATHI</Link>
      </div>
      <nav>
        <Link href="/" style={{ marginRight: '15px' }}>Home</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
