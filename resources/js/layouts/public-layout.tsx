import { PropsWithChildren } from 'react';
import { StoreHeader } from '@/components/store-header';
import { StoreFooter } from '@/components/store-footer';

interface PublicLayoutProps extends PropsWithChildren {
    title?: string;
}

export function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-500 selection:text-white">
            <StoreHeader />
            <main className="flex-1">
                {children}
            </main>
            <StoreFooter />
        </div>
    );
}
