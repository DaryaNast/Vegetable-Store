import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchProducts } from './api'
import { Product } from '../types/product'

// Мокаем axios
vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
        isAxiosError: vi.fn()
    }
}))

import axios from 'axios'

describe('API Service with Axios', () => {
    const mockProducts: Product[] = [
        {
            id: 1,
            name: 'Brocolli - 1 Kg',
            price: 120,
            image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/broccoli.jpg',
        }
    ]

    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('загружает продукты успешно', async () => {
        // Arrange
        vi.mocked(axios.get).mockResolvedValue({ data: mockProducts })

        // Act
        const result = await fetchProducts()

        // Assert
        expect(axios.get).toHaveBeenCalledWith(
            'https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json'
        )
        expect(result).toEqual(mockProducts)
    })

    it('возвращает пустой массив при ошибке сети', async () => {
        // Arrange
        const axiosError = {
            isAxiosError: true,
            message: 'Network error'
        }
        vi.mocked(axios.get).mockRejectedValue(axiosError)
        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        // Act
        const result = await fetchProducts()

        // Assert
        expect(result).toEqual([])
    })

    it('возвращает пустой массив при любой другой ошибке', async () => {
        // Arrange
        vi.mocked(axios.get).mockRejectedValue(new Error('Some error'))
        vi.mocked(axios.isAxiosError).mockReturnValue(false)

        // Act
        const result = await fetchProducts()

        // Assert
        expect(result).toEqual([])
    })
})