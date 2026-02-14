import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Features', path: '/#features' },
        { name: 'How it Works', path: '/#install' },
        { name: 'Scanner', path: '/#scanner' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        if (location.pathname === '/') {
            e.preventDefault();
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                setIsMobileMenuOpen(false);
            }
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg text-white font-bold transform group-hover:rotate-3 transition-transform">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">URL SCANNER</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={(e) => link.path.startsWith('/#') && handleScrollToSection(e, link.path.substring(2))}
                                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
                            </Link>
                        ))}
                        <Link
                            to="/#scanner"
                            onClick={(e) => handleScrollToSection(e, 'scanner')}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Analyze URL
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-base font-medium text-slate-600 hover:text-blue-600 py-2"
                                    onClick={(e) => {
                                        if (link.path.startsWith('/#')) {
                                            handleScrollToSection(e, link.path.substring(2));
                                        } else {
                                            setIsMobileMenuOpen(false);
                                        }
                                    }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/#scanner"
                                className="bg-blue-600 text-white text-center font-semibold py-3 rounded-lg"
                                onClick={(e) => handleScrollToSection(e, 'scanner')}
                            >
                                Analyze URL Now
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
