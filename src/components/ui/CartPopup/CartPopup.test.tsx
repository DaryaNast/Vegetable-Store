import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { CartPopup } from './CartPopup'

// Мокаем CartContext
const mockUseCart = vi.fn()
vi.mock('../../../contexts/CartContext.tsx', () => ({
    useCart: () => mockUseCart()
}))

// Мокаем ассет картинки
vi.mock('../../../assets/images/cart_empty.svg', () => ({
    default: 'test-cart-image.svg'
}))

// Вспомогательная функция для рендеринга с MantineProvider
const renderWithMantine = (ui: React.ReactNode) => {
    return render(
        <MantineProvider>
            {ui}
        </MantineProvider>
    )
}

describe('CartPopup', () => {
    it('показывает сообщение о пустой корзине', () => {
        mockUseCart.mockReturnValue({
            items: [],
            total: 0
        })

        renderWithMantine(<CartPopup opened={true} onClose={() => {}} />)

        expect(screen.getByText('Your cart is empty :(')).toBeInTheDocument()
    })

    it('отображает товары в корзине', () => {
        const mockItems = [
            {
                id: 1,
                name: 'Product 1 - 500g',
                price: 10.99,
                image: 'image1.jpg',
                quantity: 2
            },
            {
                id: 2,
                name: 'Product 2 - 1kg',
                price: 19.99,
                image: 'image2.jpg',
                quantity: 1
            }
        ]

        mockUseCart.mockReturnValue({
            items: mockItems,
            total: 41.97,
            updateQuantity: vi.fn(),
            removeFromCart: vi.fn()
        })

        renderWithMantine(<CartPopup opened={true} onClose={() => {}} />)

        // Проверяем, что товары отображаются
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getByText('500g')).toBeInTheDocument()
        expect(screen.getByText('$21.98')).toBeInTheDocument() // 10.99 * 2

        expect(screen.getByText('Product 2')).toBeInTheDocument()
        expect(screen.getByText('1kg')).toBeInTheDocument()
        expect(screen.getByText('$19.99')).toBeInTheDocument()

        // Проверяем общую сумму
        expect(screen.getByText('$41.97')).toBeInTheDocument()
    })

    it('отображает кнопки управления количеством', () => {
        const mockItems = [{
            id: 1,
            name: 'Product 1 - 500g',
            price: 10.99,
            image: 'image1.jpg',
            quantity: 2
        }]

        mockUseCart.mockReturnValue({
            items: mockItems,
            total: 21.98,
            updateQuantity: vi.fn(),
            removeFromCart: vi.fn()
        })

        renderWithMantine(<CartPopup opened={true} onClose={() => {}} />)

        // Проверяем количество
        expect(screen.getByText('2')).toBeInTheDocument()
    })
})