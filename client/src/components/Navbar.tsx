import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className="w-full bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                    <span className="text-xl font-semibold">URL Detector</span>
                </div>

                <nav className="hidden md:flex gap-6 text-sm font-medium">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/scanner">Scanner</Link>
                </nav>
            </div>
        </header>
    );
}
