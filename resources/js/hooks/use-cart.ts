import { useState, useEffect, useCallback } from 'react';

export interface CartItem {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    image_url: string;
    quantity: number;
    category_name?: string;
}

const CART_STORAGE_KEY = 'dodolan_store_cart_v1';
const CART_EVENT = 'dodolan:cart-updated';

function getStoredCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function saveStoredCart(items: CartItem[]) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: items }));
    } catch {
        // ignore storage quota errors
    }
}

export function useCart() {
    const [items, setItems] = useState<CartItem[]>(getStoredCart);

    useEffect(() => {
        const handleCartChange = (e: Event) => {
            const customEvent = e as CustomEvent<CartItem[]>;
            if (customEvent.detail) {
                setItems(customEvent.detail);
            } else {
                setItems(getStoredCart());
            }
        };

        window.addEventListener(CART_EVENT, handleCartChange);
        window.addEventListener('storage', handleCartChange);

        return () => {
            window.removeEventListener(CART_EVENT, handleCartChange);
            window.removeEventListener('storage', handleCartChange);
        };
    }, []);

    const addItem = useCallback((
        product: { id: number; name: string; slug: string; price: number; stock: number; image_url: string; category?: { name: string } },
        qty = 1
    ) => {
        if (product.stock <= 0) return;

        const current = getStoredCart();
        const existingIndex = current.findIndex((item) => item.id === product.id);
        let updated: CartItem[];

        if (existingIndex > -1) {
            updated = [...current];
            const newQty = Math.min(updated[existingIndex].quantity + qty, product.stock);
            updated[existingIndex] = {
                ...updated[existingIndex],
                quantity: newQty,
                stock: product.stock,
                price: product.price,
            };
        } else {
            const initialQty = Math.min(qty, product.stock);
            updated = [
                ...current,
                {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    stock: product.stock,
                    image_url: product.image_url,
                    quantity: initialQty,
                    category_name: product.category?.name,
                },
            ];
        }

        saveStoredCart(updated);
        setItems(updated);
    }, []);

    const updateQuantity = useCallback((productId: number, qty: number) => {
        const current = getStoredCart();
        let updated: CartItem[];

        if (qty <= 0) {
            updated = current.filter((item) => item.id !== productId);
        } else {
            updated = current.map((item) => {
                if (item.id === productId) {
                    const validQty = Math.min(qty, item.stock);
                    return { ...item, quantity: validQty };
                }
                return item;
            });
        }

        saveStoredCart(updated);
        setItems(updated);
    }, []);

    const removeItem = useCallback((productId: number) => {
        const current = getStoredCart();
        const updated = current.filter((item) => item.id !== productId);
        saveStoredCart(updated);
        setItems(updated);
    }, []);

    const clearCart = useCallback(() => {
        saveStoredCart([]);
        setItems([]);
    }, []);

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
    };
}
