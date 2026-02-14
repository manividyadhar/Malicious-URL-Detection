import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Shield,
    Zap,
    ShieldCheck,
    Globe,
    Terminal,
    Lock,
    Download,
    ArrowRight,
    MousePointer2,
    Layers,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';
import URLScanner from '../components/URLScanner';

const FeatureCard = ({ icon: Icon, title, description, index }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
            }}
            className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 transition-all duration-300 group hover:border-blue-500/30"
        >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </motion.div>
    );
};

const InstallStep = ({ step, title, description, index }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative flex items-start gap-8 group"
        >
            {index !== 6 && (
                <div className="absolute left-[27px] top-12 bottom-0 w-1 bg-slate-100 group-last:hidden" />
            )}
            <motion.div
                whileHover={{ scale: 1.1 }}
                className="z-10 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/40 shrink-0"
            >
                {step}
            </motion.div>
            <div className="pt-3 pb-12">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

export default function Home() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <div ref={containerRef} className="relative min-h-screen font-sans selection:bg-blue-500/30">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <motion.div
                    style={{ y: backgroundY }}
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px]"
                />
                <motion.div
                    style={{ y: backgroundY }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 blur-[150px]"
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
            </div>

            {/* Hero Section */}
            <section id="home" className="relative pt-40 pb-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest mb-8 border border-blue-100 shadow-sm"
                    >
                        <Zap className="w-3 h-3 fill-blue-600" />
                        Next-Gen Security Node
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.95] mb-8"
                    >
                        Analyze URLs with <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-gradient-x">
                            Unrivaled Precision
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed mb-12"
                    >
                        Protect yourself from phishing, malware, and malicious websites using
                        our advanced deterministic detection engine. Real-time safety, simplified.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.a
                            href="#scanner"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 20px 40px -10px rgba(37, 99, 235, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-500/20 flex items-center gap-2 group"
                        >
                            Analyze URL Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.a>
                        <motion.a
                            href="#download"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-2xl bg-white/70 backdrop-blur-md text-slate-900 font-bold text-lg shadow-xl shadow-slate-200/50 border border-slate-200"
                        >
                            Download Extension
                        </motion.a>
                    </motion.div>
                </div>

                {/* Floating elements animation */}
                <div className="absolute top-[20%] left-[5%] hidden lg:block">
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-20 h-20 rounded-2xl glass flex items-center justify-center text-blue-500 rotate-[-12deg] shadow-2xl"
                    >
                        <ShieldCheck className="w-10 h-10" />
                    </motion.div>
                </div>
                <div className="absolute top-[40%] right-[5%] hidden lg:block">
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 rounded-3xl glass flex items-center justify-center text-indigo-500 rotate-[12deg] shadow-2xl"
                    >
                        <Lock className="w-12 h-12" />
                    </motion.div>
                </div>
            </section>

            {/* Scanner Section */}
            <section id="scanner" className="py-20 px-4 bg-slate-50/50 relative overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[100px] z-0"
                />
                <div className="container mx-auto relative z-10">
                    <URLScanner />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 px-4 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
                        >
                            Advanced Detection Features
                        </motion.h2>
                        <p className="max-w-2xl mx-auto text-slate-600 text-lg">
                            Our engine combines multiple security vectors to provide the most
                            accurate safety verdict for any URL you encounter.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "Instant Analysis", description: "Get results in milliseconds with our highly optimized rust-compiled detection engine." },
                            { icon: Layers, title: "15+ Security Markers", description: "Analyzes entropy, TLD structure, multi-subdomains, IP presence and phishing keywords." },
                            { icon: ShieldCheck, title: "Phishing Shield", description: "Detected patterns known to be used by scammers and high-risk banking phishes." },
                            { icon: Globe, title: "Extension Integration", description: "Seamless real-time protection while you browse Chrome, Firefox, or Brave." },
                            { icon: Terminal, title: "Power CLI Tool", description: "Automate your security workflow with our full-featured command-line interface." },
                            { icon: Lock, title: "Privacy Guarantee", description: "Zero logging. No URLs are stored. All analysis happens and expires in memory." }
                        ].map((feature, idx) => (
                            <FeatureCard key={idx} {...feature} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Download Section */}
            <section id="download" className="py-32 px-4">
                <div className="max-w-5xl mx-auto rounded-[3rem] bg-slate-900 overflow-hidden relative shadow-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20" />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500 blur-[100px]"
                    />

                    <div className="relative z-10 p-12 md:p-20 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                                Ready to Browsing <br />
                                <span className="text-blue-400">Securely?</span>
                            </h2>
                            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                                Join thousands of users who browse the web with real-time URL protection.
                                Download URGUARD Extension for your favorite browser today.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <motion.a
                                    href="/malicious-url-detector-extension.zip"
                                    download
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 rounded-2xl bg-white text-slate-900 font-black text-xl flex items-center gap-3 shadow-2xl shadow-white/10 group"
                                >
                                    <Download className="w-6 h-6 animate-bounce" />
                                    Download for Chrome
                                </motion.a>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm font-bold uppercase tracking-widest">Version v1.0.0 Stable</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Installation Instructions */}
            <section id="install" className="py-32 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-6 text-center">How to Install</h2>
                        <p className="text-slate-600 text-center max-w-lg mx-auto">
                            Setting up URGUARD is fast and easy. Follow these simple steps
                            to get real-time browser protection.
                        </p>
                    </div>

                    <div className="space-y-0">
                        {[
                            { step: "01", title: "Download Archive", description: "Click the download button above to get the malicious-url-detector-extension.zip file." },
                            { step: "02", title: "Extract Content", description: "Unzip the file to a permanent folder on your local machine." },
                            { step: "03", title: "Open Extensions", description: "Navigate to chrome://extensions in your Chrome browser address bar." },
                            { step: "04", title: "Developer Mode", description: "Locate and toggle the 'Developer Mode' switch in the top-right corner." },
                            { step: "05", title: "Load Unpacked", description: "Click the 'Load unpacked' button that appears after enabling developer mode." },
                            { step: "06", title: "Select Folder", description: "Browse to and select the extracted extension folder from step 2." },
                            { step: "07", title: "Secure Browsing", description: "URGUARD is now active! Pin it to your toolbar for easy access to scanning." }
                        ].map((step, idx) => (
                            <InstallStep key={idx} {...step} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-4 bg-slate-900 text-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto border-t border-slate-800 pt-20">
                    <div className="grid md:grid-cols-4 gap-12 mb-20">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <Shield className="w-8 h-8 text-blue-500" />
                                <span className="font-extrabold text-2xl tracking-tighter">URGUARD</span>
                            </div>
                            <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
                                The ultimate deterministic URL detection platform.
                                Protecting users from malicious web threats since 2026.
                            </p>
                            <div className="flex gap-4">
                                {[Globe, Terminal, MousePointer2].map((Icon, i) => (
                                    <motion.a
                                        key={i}
                                        href="#"
                                        whileHover={{ scale: 1.2, color: "#3b82f6" }}
                                        className="text-slate-500 transition-colors"
                                    >
                                        <Icon className="w-6 h-6" />
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-6">Product</h4>
                            <ul className="space-y-4 text-slate-400">
                                {['Scanner', 'Extension', 'CLI Tool', 'API Docs'].map(link => (
                                    <li key={link}>
                                        <motion.a href="#" whileHover={{ x: 5, color: "#fff" }} className="transition-all inline-flex items-center gap-1 group">
                                            <ChevronRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {link}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-6">Resources</h4>
                            <ul className="space-y-4 text-slate-400">
                                {['Security Lab', 'Privacy Policy', 'Github', 'Status'].map(link => (
                                    <li key={link}>
                                        <motion.a href="#" whileHover={{ x: 5, color: "#fff" }} className="transition-all inline-flex items-center gap-1 group">
                                            <ChevronRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {link}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pb-8 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
                        <p>© 2026 URGUARD Security. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">SLA</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
