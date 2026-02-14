export default function About() {
    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>
                About Malicious URL Detector
            </h1>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>
                    What is this?
                </h2>
                <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
                    Malicious URL Detector is a comprehensive security tool that helps protect you from
                    phishing attacks, malware, and other malicious websites. Using advanced heuristic
                    analysis and pattern recognition, we analyze URLs in real-time to determine their
                    safety level.
                </p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>
                    How does it work?
                </h2>
                <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                    Our detection engine analyzes multiple aspects of a URL:
                </p>
                <ul style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-secondary)', paddingLeft: '2rem' }}>
                    <li><strong>URL Structure:</strong> Length, special characters, and patterns</li>
                    <li><strong>Domain Analysis:</strong> IP addresses, suspicious TLDs, entropy</li>
                    <li><strong>Keyword Detection:</strong> 50+ phishing-related keywords</li>
                    <li><strong>Security Checks:</strong> HTTPS presence, URL shorteners</li>
                    <li><strong>Subdomain Analysis:</strong> Excessive subdomains and obfuscation</li>
                </ul>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>
                    Risk Scoring
                </h2>
                <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                    Each URL receives a risk score from 0 to 100:
                </p>
                <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: '#ecfdf5', borderLeft: '4px solid var(--color-safe)', borderRadius: 'var(--radius-md)' }}>
                        <strong style={{ color: 'var(--color-safe)' }}>0-29: Safe ✅</strong>
                        <p style={{ marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            No suspicious patterns detected. The URL appears to be legitimate.
                        </p>
                    </div>
                    <div style={{ padding: '1rem', background: '#fffbeb', borderLeft: '4px solid var(--color-suspicious)', borderRadius: 'var(--radius-md)' }}>
                        <strong style={{ color: 'var(--color-suspicious)' }}>30-69: Suspicious ⚠️</strong>
                        <p style={{ marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            Some suspicious patterns detected. Exercise caution before visiting.
                        </p>
                    </div>
                    <div style={{ padding: '1rem', background: '#fef2f2', borderLeft: '4px solid var(--color-malicious)', borderRadius: 'var(--radius-md)' }}>
                        <strong style={{ color: 'var(--color-malicious)' }}>70-100: Malicious 🚨</strong>
                        <p style={{ marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            Multiple red flags detected. Likely a phishing or malicious site.
                        </p>
                    </div>
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>
                    Available Tools
                </h2>
                <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            🌐 Web Application
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Check URLs directly in your browser. No installation required.
                        </p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            🧩 Browser Extension
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Real-time protection while browsing. Works offline with instant results.
                        </p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            💻 CLI Tool
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Command-line interface for developers, automation, and batch processing.
                        </p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            🔌 REST API
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Integrate URL checking into your own applications and services.
                        </p>
                    </div>
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>
                    Privacy & Security
                </h2>
                <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
                    We take your privacy seriously. URLs are analyzed in real-time and are not logged
                    or stored. All analysis happens on our servers with no third-party tracking or data
                    collection. The browser extension can work completely offline for maximum privacy.
                </p>
            </section>

            <section>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>
                    Open Source
                </h2>
                <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                    This project is open source and available on GitHub. Contributions are welcome!
                </p>
                <a
                    href="https://github.com/manividyadhar/Malicious-URL-Detection"
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on GitHub
                </a>
            </section>
        </div>
    );
}
