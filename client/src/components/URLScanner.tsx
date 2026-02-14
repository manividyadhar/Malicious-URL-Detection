import { useState } from 'react';

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

    const getVerdictIcon = (verdict: string) => {
        switch (verdict) {
            case 'safe':
                return '✅';
            case 'suspicious':
                return '⚠️';
            case 'malicious':
                return '🚨';
            default:
                return '❓';
        }
    };

    return (
        <div className="scanner">
            <h2 className="scanner-title">Check URL Safety</h2>

            <form onSubmit={handleScan}>
                <div className="input-group">
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter URL to check (e.g., https://example.com)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Checking...' : 'Check URL'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {loading && (
                <div className="loading">
                    Analyzing URL...
                </div>
            )}

            {result && !loading && (
                <div className={`result ${result.verdict}`}>
                    <div className="result-header">
                        <span className="result-icon">{getVerdictIcon(result.verdict)}</span>
                        <span className="result-verdict">{result.verdict}</span>
                    </div>

                    <div className="result-score">
                        Risk Score: <strong>{result.riskScore}/100</strong>
                        {result.processingTimeMs && (
                            <span> • Analyzed in {result.processingTimeMs}ms</span>
                        )}
                    </div>

                    {result.reasons && result.reasons.length > 0 && (
                        <div>
                            <strong>Reasons:</strong>
                            <ul className="result-reasons">
                                {result.reasons.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
