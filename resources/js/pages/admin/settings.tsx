import { Head, useForm } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import { 
    KeyRound, 
    User, 
    Mail, 
    Phone, 
    Save, 
    Server, 
    CheckCircle2, 
    ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { FormEventHandler, useRef } from 'react';
import PasswordInput from '@/components/password-input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

interface AdminSettingsProps {
    user: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
    passwordRules?: string;
}

export default function AdminSettings({
    user,
    passwordRules,
}: AdminSettingsProps) {
    // Profile Form
    const profileForm = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
    });

    // Password Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const handleProfileSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        profileForm.patch('/admin/settings/profile', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profil Administrator berhasil diperbarui!');
            },
        });
    };

    const handlePasswordSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        passwordForm.put('/admin/settings/password', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Kata sandi Administrator berhasil diubah!');
                passwordForm.reset();
            },
            onError: (errors) => {
                if (errors.password) {
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AdminLayout title="Pengaturan & Keamanan Admin">
            <Head title="Pengaturan & Keamanan — Admin Dodolan Store" />

            <div className="space-y-6">
                {/* Page Heading */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Pengaturan &amp; Keamanan Akun
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Kelola informasi profil administrator, kata sandi akses kontrol panel, dan integrasi sistem toko.
                    </p>
                </div>

                {/* Header Profile Badge */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-xl shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">{user.name}</h2>
                                <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 border border-emerald-300 dark:border-emerald-800">
                                    Super Administrator
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Akses Penuh Kontrol Panel</span>
                    </div>
                </div>

                {/* 2-Column Grid: Profile (Left) & Password (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Left Column: Admin Profile */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                    Informasi Profil Administrator
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Identitas pengelola platform Dodolan Store.
                                </p>
                            </div>
                            <User className="h-5 w-5 text-emerald-600" />
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Nama Lengkap Administrator <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                </div>
                                <InputError message={profileForm.errors.name} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Alamat Email Login <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                </div>
                                <InputError message={profileForm.errors.email} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Nomor Telepon / WhatsApp
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={profileForm.data.phone}
                                        onChange={(e) => profileForm.setData('phone', e.target.value)}
                                        placeholder="Contoh: 081234567890"
                                        className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                                <InputError message={profileForm.errors.phone} className="mt-1" />
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition active:scale-95 cursor-pointer shadow-xs"
                                >
                                    {profileForm.processing ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                                    <span>Simpan Perubahan Profil</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Update Password Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                    Perbarui Kata Sandi Administrator
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Gunakan kombinasi kata sandi yang aman.
                                </p>
                            </div>
                            <KeyRound className="h-5 w-5 text-emerald-600" />
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="current_password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Kata Sandi Saat Ini
                                </Label>
                                <PasswordInput
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="rounded-xl border-slate-300 dark:border-slate-700 text-xs mt-1.5"
                                    placeholder="Masukkan kata sandi lama"
                                    autoComplete="current-password"
                                />
                                <InputError message={passwordForm.errors.current_password} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Kata Sandi Baru
                                </Label>
                                <PasswordInput
                                    id="password"
                                    ref={passwordInput}
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="rounded-xl border-slate-300 dark:border-slate-700 text-xs mt-1.5"
                                    placeholder="Minimal 8 karakter"
                                    autoComplete="new-password"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={passwordForm.errors.password} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Konfirmasi Kata Sandi Baru
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="rounded-xl border-slate-300 dark:border-slate-700 text-xs mt-1.5"
                                    placeholder="Ulangi kata sandi baru"
                                    autoComplete="new-password"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={passwordForm.errors.password_confirmation} className="mt-1" />
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition active:scale-95 cursor-pointer shadow-xs"
                                >
                                    {passwordForm.processing ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                                    <span>Simpan Kata Sandi Baru</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bottom Row: System Status (Full Width) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Informasi Sistem &amp; Integrasi Toko
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Status lingkungan runtime aplikasi Dodolan Store dan gateway pihak ketiga.
                            </p>
                        </div>
                        <Server className="h-5 w-5 text-emerald-600" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                <span>Versi Aplikasi</span>
                                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">v1.1 (Hybrid)</span>
                            </div>
                            <div className="text-slate-500">Laravel 12 + Inertia React 2.0</div>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                <span>Payment Gateway</span>
                                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Mayar API v2</span>
                            </div>
                            <div className="text-slate-500">QRIS, VA Bank &amp; E-Wallet</div>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                <span>Customer Portal</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                                </span>
                            </div>
                            <div className="text-slate-500">Pelacakan Resi &amp; IoT Tracker</div>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                <span>Keamanan Akses</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Terproteksi
                                </span>
                            </div>
                            <div className="text-slate-500">Strict Admin Authorization</div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
