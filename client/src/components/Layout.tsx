import { Link } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <header className="header">
                <div className="container header-content">
                    <Link to="/" className="logo">
                        🛡️ URL Detector
                    </Link>
                    <nav className="nav">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/about" className="nav-link">About</Link>
                    </nav>
                </div>
            </header>

            <main>{children}</main>

            <footer className="footer">
                <div className="container">
                    <p>© 2026 Malicious URL Detector. Built with ❤️ for security.</p>
                </div>
            </footer>
        </div>
    );
}
