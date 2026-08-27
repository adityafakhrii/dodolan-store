import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { PublicLayout } from '@/layouts/public-layout';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/format';

export default function Contact() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const text = `Halo Dodolan Store, nama saya ${name}. ${message}`;
        window.open(getWhatsAppLink('6281234567890', text), '_blank');
    };

    return (
        <PublicLayout>
            <Head title="Kontak Kami — Dodolan Store" />

            {/* Header */}
            <div className="bg-slate-900 text-white py-16 border-b border-slate-800">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
                            Pusat Layanan &amp; Informasi
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Hubungi Tim Dodolan Store
                        </h1>
                        <p className="text-sm text-slate-400 leading-relaxed sm:text-base">
                            Silakan hubungi kami untuk informasi katalog produk, penawaran harga khusus armada (B2B), atau konsultasi instalasi perangkat IoT.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Details & Fast Chat Form */}
            <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Contact Info Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                Kantor &amp; Layanan Pelanggan
                            </h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">Alamat Operasional</div>
                                        <div className="text-xs text-slate-500 mt-0.5">Surabaya, Jawa Timur, Indonesia</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">Telepon / WhatsApp</div>
                                        <div className="text-xs text-slate-500 mt-0.5">+62 812-3456-7890 (Customer Support)</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">Email Resmi</div>
                                        <div className="text-xs text-slate-500 mt-0.5">halo@dodolan.store</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">Jam Operasional</div>
                                        <div className="text-xs text-slate-500 mt-0.5">Senin – Sabtu: 08.00 – 17.00 WIB</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fast Response Guarantee */}
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-6 dark:bg-emerald-950/20">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">Respon Cepat via WhatsApp</h3>
                            </div>
                            <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed">
                                Pesan yang masuk pada jam operasional akan direspon oleh tim teknis kami dalam waktu kurang dari 15 menit.
                            </p>
                        </div>
                    </div>

                    {/* Right: Quick Direct WhatsApp Form */}
                    <div className="lg:col-span-7">
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-emerald-600" />
                                <span>Kirim Pesan Langsung ke CS WhatsApp</span>
                            </h2>
                            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                                Tuliskan nama dan kebutuhan Anda di bawah ini, lalu klik tombol untuk langsung terhubung ke chat WhatsApp resmi Dodolan Store.
                            </p>

                            <form onSubmit={handleSendMessage} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Nama Anda / Nama Perusahaan
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Contoh: Budi Santoso (PT Maju Logistik)"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Pesan / Kebutuhan Perangkat IoT
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Contoh: Saya ingin menanyakan harga GPS Tracker GT-400 dan biaya pemasangan untuk 10 unit truk di Surabaya."
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition active:scale-95"
                                >
                                    <Send className="h-4 w-4" />
                                    <span>Buka Chat WhatsApp Sekarang</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
