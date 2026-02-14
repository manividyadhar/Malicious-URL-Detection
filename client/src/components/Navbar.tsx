import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4">
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="max-w-6xl mx-auto px-6 py-3 rounded-2xl glass flex items-center justify-between"
            >
                <Link
                    to="/"
                    onClick={scrollToTop}
                    className="flex items-center gap-3 group transition-all"
                    aria-label="URL Detector Home"
                >
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="flex-shrink-0"
                    >
                        <Logo className="w-8 h-8 md:w-10 md:h-10" />
                    </motion.div>
                    <span className="font-extrabold text-lg md:text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                        URL Detector
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Scanner', path: isHome ? '#scanner' : '/#scanner' },
                        { name: 'Features', path: isHome ? '#features' : '/#features' },
                        { name: 'About', path: '/about' },
                        { name: 'Download', path: isHome ? '#download' : '/#download' }
                    ].map((item) => (
                        <motion.div key={item.name} whileHover={{ y: -2 }}>
                            {item.path.startsWith('#') ? (
                                <a
                                    href={item.path}
                                    className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    {item.name}
                                </a>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`text-sm font-semibold transition-colors ${location.pathname === item.path ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>

                <Link
                    to={isHome ? "#scanner" : "/#scanner"}
                    className="hidden md:block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-black/10 active:scale-95"
                    onClick={(e) => {
                        if (isHome) {
                            e.preventDefault();
                            document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                >
                    Check URL
                </Link>
            </motion.div>
        </nav>
    );
}
