import URLScanner from '../components/URLScanner';

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1 className="hero-title">Malicious URL Detector</h1>
                    <p className="hero-subtitle">
                        Protect yourself from phishing, malware, and malicious websites.
                        Analyze URLs instantly with our advanced detection engine.
                    </p>
                    <div className="btn-group">
                        <a href="#scanner" className="btn btn-primary">Check URL</a>
                        <a href="#download" className="btn btn-secondary">Download Extension</a>
                    </div>
                </div>
            </section>

            {/* Scanner Section */}
            <section id="scanner">
                <div className="container">
                    <URLScanner />
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <div className="container">
                    <h2 className="how-it-works-title">How It Works</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3 className="step-title">Enter URL</h3>
                            <p className="step-description">
                                Paste any URL you want to check for safety
                            </p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3 className="step-title">AI Analysis</h3>
                            <p className="step-description">
                                Our engine analyzes 15+ security features instantly
                            </p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3 className="step-title">Get Results</h3>
                            <p className="step-description">
                                Receive a clear verdict: Safe, Suspicious, or Malicious
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2 className="features-title">Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3 className="feature-title">Instant Analysis</h3>
                            <p className="feature-description">
                                Get results in milliseconds with our optimized detection engine
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h3 className="feature-title">15+ Detection Features</h3>
                            <p className="feature-description">
                                Analyzes URL structure, keywords, TLDs, entropy, and more
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🛡️</div>
                            <h3 className="feature-title">Phishing Protection</h3>
                            <p className="feature-description">
                                Detects common phishing patterns and suspicious keywords
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🌐</div>
                            <h3 className="feature-title">Browser Extension</h3>
                            <p className="feature-description">
                                Real-time protection while browsing (Chrome, Firefox, Edge)
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💻</div>
                            <h3 className="feature-title">CLI Tool</h3>
                            <p className="feature-description">
                                Command-line interface for developers and automation
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3 className="feature-title">Privacy First</h3>
                            <p className="feature-description">
                                No URL logging, all analysis happens in real-time
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download Section */}
            <section id="download" className="hero">
                <div className="container">
                    <h2 className="hero-title" style={{ fontSize: '2rem' }}>
                        Download Browser Extension
                    </h2>
                    <p className="hero-subtitle">
                        Get real-time protection while browsing. Available for Chrome, Firefox, and Edge.
                    </p>
                    <div className="btn-group">
                        <button className="btn btn-primary" disabled>
                            Extension Coming Soon
                        </button>
                        <a href="/about" className="btn btn-secondary">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
