import {Product} from './product';

export interface CartItem {
    quantity: number;
    id: number;
    name: string;
    price: number;
    image: string;
}

export interface CartContentType {
    items: CartItem[];
    total: number;
    itemCount: number;

    addToCart: (product: Product, quantity: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: (id: number) => void;
}

