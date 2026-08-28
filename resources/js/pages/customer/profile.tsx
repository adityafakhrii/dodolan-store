import { useForm, Link } from '@inertiajs/react';
import { CustomerLayout } from '@/layouts/customer-layout';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Save, 
    ShieldCheck, 
    KeyRound, 
    ArrowRight,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    user: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    status?: string;
}

export default function CustomerProfile({ user, status }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/akun/profil', {
            onSuccess: () => {
                toast.success('Profil dan alamat pengiriman default berhasil disimpan.');
            },
            onError: () => {
                toast.error('Gagal memperbarui profil. Silakan periksa kembali formulir.');
            },
        });
    };

    return (
        <CustomerLayout
            title="Pengaturan Profil &amp; Alamat"
            description="Kelola informasi identitas, nomor WhatsApp, dan alamat pengiriman default Anda."
        >
            <div className="space-y-6">
                {/* Profile & Address Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6"
                >
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                            Informasi Kontak &amp; Alamat Default
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Data ini akan otomatis terisi setiap kali Anda melakukan checkout pesanan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Nama Lengkap <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama Lengkap Anda"
                                    className={`w-full rounded-xl border px-4 pl-10 py-2.5 text-xs text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-white ${
                                        errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
                                    }`}
                                />
                                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            </div>
                            {errors.name && <p className="mt-1 text-[11px] text-rose-500">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Alamat Email <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                    className={`w-full rounded-xl border px-4 pl-10 py-2.5 text-xs text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-white ${
                                        errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
                                    }`}
                                />
                                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            </div>
                            {errors.email && <p className="mt-1 text-[11px] text-rose-500">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Nomor WhatsApp / Telepon Aktif
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                    className={`w-full rounded-xl border px-4 pl-10 py-2.5 text-xs text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-white ${
                                        errors.phone ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
                                    }`}
                                />
                                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            </div>
                            {errors.phone && <p className="mt-1 text-[11px] text-rose-500">{errors.phone}</p>}
                        </div>

                        {/* Default Address */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Alamat Pengiriman Lengkap
                            </label>
                            <div className="relative">
                                <textarea
                                    rows={4}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Tuliskan nama jalan, nomor gedung/rumah, kelurahan, kecamatan, kota/kabupaten, provinsi, dan kode pos..."
                                    className={`w-full rounded-xl border px-4 py-2.5 text-xs text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-white ${
                                        errors.address ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
                                    }`}
                                />
                            </div>
                            {errors.address && <p className="mt-1 text-[11px] text-rose-500">{errors.address}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition disabled:opacity-50"
                        >
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            <span>Simpan Perubahan</span>
                        </button>
                    </div>
                </form>

                {/* Account Security Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Keamanan &amp; Kata Sandi
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Jaga keamanan akun Anda dengan memperbarui kata sandi secara berkala.
                            </p>
                        </div>
                        <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                        <div className="flex items-center gap-3">
                            <KeyRound className="h-5 w-5 text-slate-400" />
                            <div className="text-xs">
                                <p className="font-bold text-slate-800 dark:text-slate-200">Ubah Kata Sandi</p>
                                <p className="text-slate-400">Atur kata sandi baru untuk akses akun pelanggan Anda.</p>
                            </div>
                        </div>

                        <Link
                            href="/settings/security"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                        >
                            <span>Ubah Kata Sandi</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
