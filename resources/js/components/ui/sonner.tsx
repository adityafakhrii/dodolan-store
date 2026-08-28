import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { 
    CheckCircle2, 
    AlertCircle, 
    Info, 
    AlertTriangle, 
    Loader2 
} from 'lucide-react';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance === 'dark' ? 'dark' : 'light'}
            className="toaster group"
            position="bottom-right"
            closeButton
            duration={4000}
            icons={{
                success: (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                ),
                info: (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/80 dark:text-sky-400 border border-sky-200/80 dark:border-sky-800/60">
                        <Info className="h-3.5 w-3.5" />
                    </div>
                ),
                warning: (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60">
                        <AlertTriangle className="h-3.5 w-3.5" />
                    </div>
                ),
                error: (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60">
                        <AlertCircle className="h-3.5 w-3.5" />
                    </div>
                ),
                loading: (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    </div>
                ),
            }}
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-white/95 dark:group-[.toaster]:bg-slate-900/95 group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-slate-200/90 dark:group-[.toaster]:border-slate-800 group-[.toaster]:shadow-xl group-[.toaster]:shadow-slate-900/5 group-[.toaster]:backdrop-blur-md group-[.toaster]:rounded-2xl group-[.toaster]:p-3.5 group-[.toaster]:gap-3 group-[.toaster]:font-sans',
                    title: 'text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-snug',
                    description: 'text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5',
                    actionButton: 'group-[.toast]:bg-emerald-600 group-[.toast]:text-white font-bold text-xs rounded-xl px-3 py-1.5 hover:bg-emerald-500 transition',
                    cancelButton: 'group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 text-xs font-semibold rounded-xl px-3 py-1.5 hover:bg-slate-200 dark:group-[.toast]:bg-slate-800 dark:group-[.toast]:text-slate-300',
                    closeButton: '!bg-slate-100 !text-slate-400 hover:!text-slate-700 hover:!bg-slate-200 dark:!bg-slate-800 dark:!text-slate-400 dark:hover:!text-white border-0 transition',
                    success: '!border-emerald-200/80 dark:!border-emerald-900/40',
                    error: '!border-rose-200/80 dark:!border-rose-900/40',
                    warning: '!border-amber-200/80 dark:!border-amber-900/40',
                    info: '!border-sky-200/80 dark:!border-sky-900/40',
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
