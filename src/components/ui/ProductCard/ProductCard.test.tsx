import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { ProductCard } from './ProductCard'
import { Product } from '../../../types/product'

// Мокаем CartContext
const mockAddToCart = vi.fn()
vi.mock('../../../contexts/CartContext.tsx', () => ({
    useCart: () => ({
        addToCart: mockAddToCart
    })
}))

// Обертка с MantineProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <MantineProvider>
        {children}
    </MantineProvider>
)

const mockProduct: Product = {
    id: 1,
    name: 'Test Product - 500g',
    price: 15.99,
    image: 'test-image.jpg',
}

describe('ProductCard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('корректно отображает данные продукта', () => {
        render(<ProductCard product={mockProduct} />, { wrapper: TestWrapper })

        expect(screen.getByText('Test Product')).toBeInTheDocument()
        expect(screen.getByText('500g')).toBeInTheDocument()
        expect(screen.getByText('$ 15.99')).toBeInTheDocument()
    })

    it('увеличивает количество при нажатии на плюс', () => {
        render(<ProductCard product={mockProduct} />, { wrapper: TestWrapper })

        const quantityElement = screen.getByText('1')
        const buttons = screen.getAllByRole('button')
        const plusButton = buttons[1] // Вторая кнопка - плюс

        expect(quantityElement).toHaveTextContent('1')

        fireEvent.click(plusButton)
        expect(quantityElement).toHaveTextContent('2')
    })

    it('уменьшает количество при нажатии на минус', () => {
        render(<ProductCard product={mockProduct} />, { wrapper: TestWrapper })

        const quantityElement = screen.getByText('1')
        const buttons = screen.getAllByRole('button')
        const plusButton = buttons[1]
        const minusButton = buttons[0]

        // Сначала увеличиваем до 2
        fireEvent.click(plusButton)
        expect(quantityElement).toHaveTextContent('2')

        // Затем уменьшаем
        fireEvent.click(minusButton)
        expect(quantityElement).toHaveTextContent('1')
    })

    it('не позволяет уменьшить количество ниже 1', () => {
        render(<ProductCard product={mockProduct} />, { wrapper: TestWrapper })

        const quantityElement = screen.getByText('1')
        const buttons = screen.getAllByRole('button')
        const minusButton = buttons[0]

        // Проверяем начальное состояние
        expect(quantityElement).toHaveTextContent('1')

        // Пытаемся уменьшить
        fireEvent.click(minusButton)

        // Должно остаться 1
        expect(quantityElement).toHaveTextContent('1')
    })

    it('имеет кнопку добавления в корзину', () => {
        render(<ProductCard product={mockProduct} />, { wrapper: TestWrapper })

        expect(screen.getByText('Add to cart')).toBeInTheDocument()
    })

    it('вызывает addToCart при нажатии на кнопку добавления', () => {
        render(<ProductCard product={mockProduct} />, { wrapper: TestWrapper })

        const addToCartButton = screen.getByText('Add to cart')

        fireEvent.click(addToCartButton)

        expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1)
    })
})