import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { Header } from './Header'

// Мокаем CartContext
const mockUseCart = vi.fn()
vi.mock('../../../contexts/CartContext.tsx', () => ({
    useCart: () => mockUseCart()
}))

// Мокаем CartPopup
vi.mock('../../ui/CartPopup/CartPopup.tsx', () => ({
    CartPopup: ({ opened }: any) =>
        opened ? <div data-testid="cart-popup">Cart Popup</div> : null
}))

// Мокаем ассет логотипа
vi.mock('../../../assets/images/logo.svg', () => ({
    default: 'test-logo.svg'
}))

// Обертка с MantineProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <MantineProvider>
        {children}
    </MantineProvider>
)

describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('отображает логотип', () => {
        mockUseCart.mockReturnValue({ itemCount: 0 })

        render(<Header />, { wrapper: TestWrapper })

        expect(screen.getByAltText('logo')).toBeInTheDocument()
    })

    it('отображает кнопку корзины', () => {
        mockUseCart.mockReturnValue({ itemCount: 0 })

        render(<Header />, { wrapper: TestWrapper })

        expect(screen.getByText('Cart')).toBeInTheDocument()
    })

    it('показывает количество товаров в корзине', () => {
        mockUseCart.mockReturnValue({ itemCount: 3 })

        render(<Header />, { wrapper: TestWrapper })

        expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('не показывает бейдж при пустой корзине', () => {
        mockUseCart.mockReturnValue({ itemCount: 0 })

        render(<Header />, { wrapper: TestWrapper })

        // Проверяем, что кнопка корзины есть, но бейджа с "0" нет
        expect(screen.getByText('Cart')).toBeInTheDocument()
        expect(screen.queryByText('0')).not.toBeInTheDocument()
    })
})