import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldAlert, ShieldCheck, ShieldQuestion, Loader2, Info } from 'lucide-react';

interface ScanResult {
    url: string;
    isValid: boolean;
    riskScore: number;
    verdict: 'safe' | 'suspicious' | 'malicious';
    reasons: string[];
    processingTimeMs?: number;
}

export default function URLScanner() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState('');

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/api/check-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error('Failed to check URL');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getVerdictStyles = (verdict: string) => {
        switch (verdict) {
            case 'safe':
                return 'bg-emerald-50 border-emerald-200 text-emerald-800';
            case 'suspicious':
                return 'bg-amber-50 border-amber-200 text-amber-800';
            case 'malicious':
                return 'bg-rose-50 border-rose-200 text-rose-800';
            default:
                return 'bg-slate-50 border-slate-200 text-slate-800';
        }
    };

    const getVerdictIcon = (verdict: string) => {
        switch (verdict) {
            case 'safe':
                return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
            case 'suspicious':
                return <ShieldAlert className="w-6 h-6 text-amber-500" />;
            case 'malicious':
                return <ShieldAlert className="w-6 h-6 text-rose-500" />;
            default:
                return <ShieldQuestion className="w-6 h-6 text-slate-500" />;
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Check URL Safety
            </h2>

            <form onSubmit={handleScan} className="mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                            placeholder="Enter URL (e.g., https://example.com)"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                        {loading ? 'Checking...' : 'Check URL'}
                    </motion.button>
                </div>
            </form>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 flex items-start gap-3"
                    >
                        <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </motion.div>
                )}

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 flex flex-col items-center justify-center gap-4 text-slate-500"
                    >
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        <p className="font-medium animate-pulse">Analyzing security features...</p>
                    </motion.div>
                )}

                {result && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`p-6 rounded-3xl border-2 ${getVerdictStyles(result.verdict)}`}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-white shadow-sm">
                                {getVerdictIcon(result.verdict)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold uppercase tracking-tight">
                                    {result.verdict}
                                </h3>
                                <p className="text-sm opacity-80">
                                    Risk Score: {result.riskScore}/100 • {result.processingTimeMs}ms
                                </p>
                            </div>
                        </div>

                        {result.reasons && result.reasons.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 font-bold text-sm">
                                    <Info className="w-4 h-4" />
                                    DETECTION REASONS
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {result.reasons.map((reason, index) => (
                                        <motion.li
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            key={index}
                                            className="text-sm px-3 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 flex items-center gap-2"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                            {reason}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
