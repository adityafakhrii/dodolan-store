import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface CustomSelectOption {
    value: string;
    label: string;
    description?: string;
    badge?: string;
}

export interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: CustomSelectOption[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Pilih opsi...',
    className = '',
    disabled = false,
    size = 'md',
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const sizeClasses = {
        sm: 'py-1.5 px-3 text-xs',
        md: 'py-2 px-3.5 text-xs',
        lg: 'py-2.5 px-4 text-sm',
    };

    return (
        <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 focus:border-emerald-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80 ${
                    sizeClasses[size]
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
                    isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-500' : ''
                }`}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : <span className="text-slate-400 font-normal">{placeholder}</span>}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 z-50 mt-1.5 w-full min-w-[200px] origin-top-left rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto">
                    {options.map((option) => {
                        const isSelected = String(option.value) === String(value);
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-semibold transition ${
                                    isSelected
                                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold'
                                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                }`}
                            >
                                <div className="flex flex-col min-w-0 pr-2">
                                    <span className="truncate">{option.label}</span>
                                    {option.description && (
                                        <span className="text-[10px] text-slate-400 font-normal">{option.description}</span>
                                    )}
                                </div>
                                {isSelected && (
                                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
