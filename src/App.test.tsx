import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { CartProvider } from './contexts/CartContext'
import App from './App'

// Мокаем window.matchMedia перед импортом компонентов
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Мокаем ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

// Мокаем API
const mockProducts = [
    {
        id: 1,
        name: 'Product 1 - 500g',
        price: 10.99,
        image: 'image1.jpg',
        category: 'food'
    },
    {
        id: 2,
        name: 'Product 2 - 1kg',
        price: 19.99,
        image: 'image2.jpg',
        category: 'food'
    }
]

// Мокаем fetchProducts
vi.mock('./services/api.ts', () => ({
    fetchProducts: vi.fn()
}))

// Импортируем мок после объявления
import { fetchProducts } from './services/api.ts'

// Обертка для тестов
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <MantineProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </MantineProvider>
    )
}

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('отображает заголовок каталога', async () => {
        vi.mocked(fetchProducts).mockResolvedValue(mockProducts)

        render(<App />, { wrapper: TestWrapper })

        expect(screen.getByTestId('catalog-title')).toHaveTextContent('Catalog')
    })

    it('показывает лоадеры во время загрузки', () => {
        vi.mocked(fetchProducts).mockImplementation(() => new Promise(() => {}))

        render(<App />, { wrapper: TestWrapper })

        const loaders = screen.getAllByTestId('loading-card')
        expect(loaders).toHaveLength(12)
    })

    it('отображает продукты после загрузки', async () => {
        vi.mocked(fetchProducts).mockResolvedValue(mockProducts)

        render(<App />, { wrapper: TestWrapper })

        await waitFor(() => {
            expect(screen.queryByTestId('loading-card')).not.toBeInTheDocument()
        })

        expect(screen.getByTestId('products-grid')).toBeInTheDocument()
    })

    it('показывает ошибку при неудачной загрузке', async () => {
        vi.mocked(fetchProducts).mockRejectedValue(new Error('Network error'))

        render(<App />, { wrapper: TestWrapper })

        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toBeInTheDocument()
            expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to load products')
        })
    })
})