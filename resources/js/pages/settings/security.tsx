import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { CustomerLayout } from '@/layouts/customer-layout';
import { KeyRound, Save } from 'lucide-react';

interface Props {
    passwordRules: string;
}

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <CustomerLayout
            title="Keamanan & Kata Sandi"
            description="Kelola dan perbarui kata sandi akun pelanggan Anda untuk menjaga keamanan transaksi."
        >
            <div className="space-y-6">
                {/* Update Password Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Perbarui Kata Sandi
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Pastikan akun Anda menggunakan kata sandi yang aman dan tidak digunakan di situs lain.
                            </p>
                        </div>
                        <KeyRound className="h-5 w-5 text-emerald-600" />
                    </div>

                    <Form
                        {...SecurityController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="space-y-5"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-4 max-w-lg">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="current_password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                            Kata Sandi Saat Ini
                                        </Label>
                                        <PasswordInput
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            className="rounded-xl border-slate-300 dark:border-slate-700 text-xs"
                                            autoComplete="current-password"
                                            placeholder="Masukkan kata sandi lama"
                                        />
                                        <InputError message={errors.current_password} className="mt-1" />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                            Kata Sandi Baru
                                        </Label>
                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            className="rounded-xl border-slate-300 dark:border-slate-700 text-xs"
                                            autoComplete="new-password"
                                            placeholder="Minimal 8 karakter"
                                            passwordrules={props.passwordRules}
                                        />
                                        <InputError message={errors.password} className="mt-1" />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="password_confirmation" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                            Konfirmasi Kata Sandi Baru
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            className="rounded-xl border-slate-300 dark:border-slate-700 text-xs"
                                            autoComplete="new-password"
                                            placeholder="Ulangi kata sandi baru"
                                            passwordrules={props.passwordRules}
                                        />
                                        <InputError
                                            message={errors.password_confirmation}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-start">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
                                        data-test="update-password-button"
                                    >
                                        {processing ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                                        <span>Simpan Kata Sandi</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </CustomerLayout>
    );
}
