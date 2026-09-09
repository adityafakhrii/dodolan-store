import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

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

    const syncCart = useCallback(async (options?: { notify?: boolean }) => {
        const current = getStoredCart();
        if (current.length === 0) {
            return { hasChanges: false, priceChanged: false, stockClamped: false, inactiveRemoved: false };
        }

        try {
            const ids = current.map((item) => item.id).join(',');
            const response = await fetch(`/keranjang/sync?ids=${ids}`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                return { hasChanges: false, priceChanged: false, stockClamped: false, inactiveRemoved: false };
            }

            const data = await response.json();
            const serverItems: Array<{
                id: number;
                name: string;
                slug: string;
                price: number;
                stock: number;
                status: boolean;
                image_url: string;
            }> = data.items || [];

            if (serverItems.length === 0) {
                return { hasChanges: false, priceChanged: false, stockClamped: false, inactiveRemoved: false };
            }

            const serverMap = new Map(serverItems.map((p) => [p.id, p]));
            let hasChanges = false;
            let priceChanged = false;
            let stockClamped = false;
            let inactiveRemoved = false;

            const updated: CartItem[] = [];

            for (const item of current) {
                const serverProduct = serverMap.get(item.id);

                // If product deleted or marked inactive or out of stock
                if (!serverProduct || !serverProduct.status || serverProduct.stock <= 0) {
                    hasChanges = true;
                    inactiveRemoved = true;
                    continue;
                }

                // Check if price changed
                if (serverProduct.price !== item.price) {
                    hasChanges = true;
                    priceChanged = true;
                }

                // Check if stock changed and exceeds available stock
                let newQty = item.quantity;
                if (item.quantity > serverProduct.stock) {
                    newQty = serverProduct.stock;
                    hasChanges = true;
                    stockClamped = true;
                }

                updated.push({
                    ...item,
                    name: serverProduct.name,
                    slug: serverProduct.slug,
                    price: serverProduct.price,
                    stock: serverProduct.stock,
                    image_url: serverProduct.image_url || item.image_url,
                    quantity: newQty,
                });
            }

            if (hasChanges) {
                saveStoredCart(updated);
                setItems(updated);

                if (options?.notify !== false) {
                    if (priceChanged) {
                        toast.info('Harga produk di keranjang Anda telah disesuaikan dengan data terkini.');
                    }
                    if (stockClamped) {
                        toast.warning('Jumlah pesanan disesuaikan dengan sisa stok yang tersedia.');
                    }
                    if (inactiveRemoved) {
                        toast.warning('Produk yang sudah tidak aktif atau habis telah dihapus dari keranjang.');
                    }
                }
            }

            return { hasChanges, priceChanged, stockClamped, inactiveRemoved };
        } catch {
            return { hasChanges: false, priceChanged: false, stockClamped: false, inactiveRemoved: false };
        }
    }, []);

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        syncCart,
        itemCount,
        subtotal,
    };
}
