import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext'

// Компонент для тестирования контекста
const TestComponent = () => {
    const { addToCart, items, total, itemCount } = useCart()

    const handleAdd = () => {
        addToCart({
            id: 1,
            name: 'Test Product - 500g',
            price: 15.99,
            image: 'test.jpg',
            category: 'food' // Добавляем обязательное поле category
        }, 2)
    }

    return (
        <div>
            <button onClick={handleAdd}>Add Item</button>
            <div data-testid="item-count">{itemCount}</div>
            <div data-testid="total">{total.toFixed(2)}</div>
            <div data-testid="items-length">{items.length}</div>
        </div>
    )
}

describe('CartContext', () => {
    it('предоставляет контекст корзины', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        )

        expect(screen.getByTestId('item-count')).toHaveTextContent('0')
        expect(screen.getByTestId('total')).toHaveTextContent('0.00')
        expect(screen.getByTestId('items-length')).toHaveTextContent('0')
    })

    it('добавляет товары в корзину', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        )

        fireEvent.click(screen.getByText('Add Item'))

        expect(screen.getByTestId('item-count')).toHaveTextContent('2')
        expect(screen.getByTestId('total')).toHaveTextContent('31.98') // 15.99 * 2
        expect(screen.getByTestId('items-length')).toHaveTextContent('1')
    })
})