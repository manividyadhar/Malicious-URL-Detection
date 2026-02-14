export default function About() {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">
                About URL Scanner
            </h1>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    What is this?
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                    URL Scanner is a comprehensive security tool that helps protect you from
                    phishing attacks, malware, and other malicious websites. Using advanced heuristic
                    analysis and pattern recognition, we analyze URLs in real-time to determine their
                    safety level.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    How does it work?
                </h2>
                <p className="text-lg text-slate-600 mb-4">
                    Our detection engine analyzes multiple aspects of a URL:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 text-lg">
                    <li><strong className="text-slate-900">URL Structure:</strong> Length, special characters, and patterns</li>
                    <li><strong className="text-slate-900">Domain Analysis:</strong> IP addresses, suspicious TLDs, entropy</li>
                    <li><strong className="text-slate-900">Keyword Detection:</strong> 50+ phishing-related keywords</li>
                    <li><strong className="text-slate-900">Security Checks:</strong> HTTPS presence, URL shorteners</li>
                    <li><strong className="text-slate-900">Subdomain Analysis:</strong> Excessive subdomains and obfuscation</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Risk Scoring
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                    Each URL receives a risk score from 0 to 100:
                </p>
                <div className="grid gap-4">
                    <div className="p-6 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl">
                        <strong className="text-emerald-700 block text-lg mb-1">0-29: Safe ✅</strong>
                        <p className="text-emerald-800/80">
                            No suspicious patterns detected. The URL appears to be legitimate.
                        </p>
                    </div>
                    <div className="p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
                        <strong className="text-amber-700 block text-lg mb-1">30-69: Suspicious ⚠️</strong>
                        <p className="text-amber-800/80">
                            Some suspicious patterns detected. Exercise caution before visiting.
                        </p>
                    </div>
                    <div className="p-6 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl">
                        <strong className="text-rose-700 block text-lg mb-1">70-100: Malicious 🚨</strong>
                        <p className="text-rose-800/80">
                            Multiple red flags detected. Likely a phishing or malicious site.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Available Tools
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {[
                        { title: "🌐 Web Application", desc: "Check URLs directly in your browser. No installation required." },
                        { title: "🧩 Browser Extension", desc: "Real-time protection while browsing. Works offline with instant results." },
                        { title: "💻 CLI Tool", desc: "Command-line interface for developers, automation, and batch processing." },
                        { title: "🔌 REST API", desc: "Integrate URL checking into your own applications and services." }
                    ].map((tool, i) => (
                        <div key={i} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.title}</h3>
                            <p className="text-slate-600">{tool.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Privacy & Security
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                    We take your privacy seriously. URLs are analyzed in real-time and are not logged
                    or stored. All analysis happens on our servers with no third-party tracking or data
                    collection. The browser extension can work completely offline for maximum privacy.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Open Source
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                    This project is open source and available on GitHub. Contributions are welcome!
                </p>
                <a
                    href="https://github.com/manividyadhar/Malicious-URL-Detection"
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on GitHub
                </a>
            </section>
        </div>
    );
}
