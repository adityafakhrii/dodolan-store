import { Head, useForm } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import { 
    Shield, 
    KeyRound, 
    User, 
    Mail, 
    Phone, 
    Save, 
    Server, 
    CheckCircle2, 
    Lock,
    ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { FormEventHandler, useRef, useState } from 'react';
import PasswordInput from '@/components/password-input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';

interface AdminSettingsProps extends ManagePasskeysProps, ManageTwoFactorProps {
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
    canManageTwoFactor,
    requiresConfirmation,
    twoFactorEnabled,
    canManagePasskeys,
    passkeys,
    passwordRules,
}: AdminSettingsProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'system'>('profile');

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

            <div className="mx-auto max-w-5xl space-y-6">
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

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                                activeTab === 'profile'
                                    ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            Profil Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('security')}
                            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                                activeTab === 'security'
                                    ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            Keamanan &amp; 2FA
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('system')}
                            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                                activeTab === 'system'
                                    ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            Sistem Toko
                        </button>
                    </div>
                </div>

                {/* Tab 1: Profile Form */}
                {activeTab === 'profile' && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Informasi Profil Administrator
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Informasi ini digunakan untuk identitas pengelola platform Dodolan Store.
                            </p>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-xl">
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
                )}

                {/* Tab 2: Security & Password */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        {/* Update Password Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                        Perbarui Kata Sandi Administrator
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Gunakan kombinasi kata sandi yang kuat untuk menjaga keamanan akses kontrol panel.
                                    </p>
                                </div>
                                <KeyRound className="h-5 w-5 text-emerald-600" />
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-xl">
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

                        {/* Two-Factor Authentication Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
                            <ManageTwoFactor
                                canManageTwoFactor={canManageTwoFactor}
                                requiresConfirmation={requiresConfirmation}
                                twoFactorEnabled={twoFactorEnabled}
                            />
                        </div>

                        {/* Passkeys Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
                            <ManagePasskeys
                                canManagePasskeys={canManagePasskeys}
                                passkeys={passkeys}
                            />
                        </div>
                    </div>
                )}

                {/* Tab 3: System Status */}
                {activeTab === 'system' && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                    <span>Versi Dodolan Store</span>
                                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">v1.1 (Hybrid)</span>
                                </div>
                                <div className="text-slate-500">Framework: Laravel 12 + Inertia React 2.0</div>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                    <span>Payment Gateway</span>
                                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Mayar API v2</span>
                                </div>
                                <div className="text-slate-500">Metode: QRIS, VA BCA/Mandiri/BNI/BRI, E-Wallet</div>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                    <span>Customer Portal Architecture</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                                    </span>
                                </div>
                                <div className="text-slate-500">Fitur: Tracking Resi, Riwayat IoT, Pengajuan Layanan</div>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                    <span>Keamanan &amp; Hardening</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                        <ShieldCheck className="h-3.5 w-3.5" /> 2FA &amp; Passkeys
                                    </span>
                                </div>
                                <div className="text-slate-500">Otentikasi: Role-based redirect &amp; strict admin authorization</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
