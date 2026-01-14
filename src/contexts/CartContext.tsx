import React, { createContext, useContext, useState } from 'react';
import { CartItem, CartContentType } from "../types/cart.ts";
import {Product} from "../types/product.ts";

const CartContext = createContext<CartContentType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const addToCart = (product: Product, quantity: number) => {
        const newItem: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        }
        setItems([...items, newItem]);
    }

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }

    const removeFromCart = (id: number) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    }

    const clearCart = () => {
        setItems([]);
    }

    const value: CartContentType = {
        items,
        total,
        addToCart,
        itemCount,
        updateQuantity,
        removeFromCart,
        clearCart,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error('useCart нужно использовать внутри CartProvider')
    }
    return context
}

