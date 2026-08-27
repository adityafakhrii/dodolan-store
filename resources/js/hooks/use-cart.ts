import { useState, useEffect } from 'react';

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

export function useCart() {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch {
            // ignore storage quota errors
        }
    }, [items]);

    const addItem = (product: { id: number; name: string; slug: string; price: number; stock: number; image_url: string; category?: { name: string } }, qty = 1) => {
        if (product.stock <= 0) return;

        setItems((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                const newQty = Math.min(updated[existingIndex].quantity + qty, product.stock);
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: newQty,
                    stock: product.stock,
                    price: product.price,
                };
                return updated;
            }

            const initialQty = Math.min(qty, product.stock);
            return [
                ...prev,
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
        });
    };

    const updateQuantity = (productId: number, qty: number) => {
        setItems((prev) => {
            if (qty <= 0) {
                return prev.filter((item) => item.id !== productId);
            }
            return prev.map((item) => {
                if (item.id === productId) {
                    const validQty = Math.min(qty, item.stock);
                    return { ...item, quantity: validQty };
                }
                return item;
            });
        });
    };

    const removeItem = (productId: number) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setItems([]);
    };

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
