import { motion } from 'framer-motion';
import {
    Zap,
    ShieldCheck,
    Globe,
    Terminal,
    Lock,
    Download,
    Server
} from 'lucide-react';
import URLScanner from '../components/URLScanner';

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
        </motion.div>
    );
};

const TrustBadge = ({ icon: Icon, label }: any) => (
    <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
    </div>
);

export default function Home() {
    return (
        <div className="relative font-sans text-slate-900 overflow-hidden">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px] opacity-60 translate-x-1/4 -translate-y-1/4" />
                    <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px] opacity-60 -translate-x-1/4 translate-y-1/4" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-8 border border-blue-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Live Threat Intelligence
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                            Secure Your Browsing with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Artificial Intelligence
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Detect malicious URLs, phishing attempts, and malware in real-time.
                            Built for developers and security-conscious users who demand precision.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <motion.a
                                href="#scanner"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                <Zap className="w-5 h-5" />
                                Start Scanning
                            </motion.a>
                            <motion.a
                                href="#install"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Get Extension
                            </motion.a>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 opacity-80">
                            <TrustBadge icon={ShieldCheck} label="Bank-Grade Security" />
                            <TrustBadge icon={Lock} label="Zero-Knowledge Privacy" />
                            <TrustBadge icon={Zap} label="<50ms Latency" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Scanner Section */}
            <section id="scanner" className="py-24 bg-white relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto relative cursor-default">
                        {/* Decorative blobbies behind scanner */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2.5rem] blur-xl opacity-50" />

                        <div className="relative">
                            <URLScanner />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Enterprise-Grade Detection Engine
                        </h2>
                        <p className="text-slate-600 text-lg">
                            We use advanced heuristics and machine learning to identify threats that traditional scanners miss.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Zap}
                            title="Real-Time Analysis"
                            description="Our Rust-compiled engine delivers verdicts in milliseconds, ensuring no latency in your browsing experience."
                            delay={0}
                        />
                        <FeatureCard
                            icon={Server}
                            title="Deep Inspection"
                            description="We analyze entropy, TLD structure, multi-subdomains, IP presence, and obfuscation techniques."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Phishing Prevention"
                            description="Automatically blocks known phishing kits and heuristics used by credential harvesters."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Browser Integration"
                            description="Seamlessly integrates with Chrome, Firefox, and Brave to protect you while you surf."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Terminal}
                            title="API & CLI"
                            description="Automate your security workflows with our developer-friendly API and command-line tools."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Privacy First"
                            description="We don't store your browsing history. All analysis is performed ephemerally in memory."
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* Installation Steps */}
            <section id="install" className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Ready in 30 Seconds
                            </h2>
                            <p className="text-slate-600 text-lg mb-8">
                                Get instant protection without complex configuration. Our extension works out of the box.
                            </p>

                            <div className="space-y-8">
                                {[
                                    { title: "Download", desc: "Get the extension package" },
                                    { title: "Install", desc: "Load unpacked in Chrome" },
                                    { title: "Protect", desc: "Enjoy safer browsing" }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{step.title}</h4>
                                            <p className="text-slate-500 text-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl transform rotate-3 opacity-10"></div>
                            <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="space-y-4 font-mono text-sm">
                                    <div className="text-green-400">$ urlscanner install</div>
                                    <div className="text-slate-300">Downloading package... <span className="text-green-400">Done</span></div>
                                    <div className="text-slate-300">Verifying signature... <span className="text-green-400">Valid</span></div>
                                    <div className="text-slate-300">Installing dependencies...</div>
                                    <div className="text-blue-400">URL SCANNER is now active and monitoring.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-[150px] opacity-20"></div>

                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Join the future of web security
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Stop relying on outdated blocklists. Switch to deterministic, AI-powered URL analysis today.
                    </p>
                    <motion.a
                        href="/malicious-url-detector-extension.zip"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all"
                    >
                        <Download className="w-5 h-5" />
                        Download Now - It's Free
                    </motion.a>
                    <p className="mt-6 text-slate-500 text-sm">
                        Requires Chrome, Firefox, or Brave Browser
                    </p>
                </div>
            </section>
        </div>
    );
}
