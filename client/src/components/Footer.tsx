import { motion } from 'framer-motion';
import { Shield, Globe, Terminal, MousePointer2, ChevronRight } from 'lucide-react';

export default function Footer() {
    return (
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
    );
}
