import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext'
import React from 'react'
import {Product} from "../types/product.ts";

// Компонент для тестирования всех функций корзины
const TestComponent = ({
                           initialAdd = false,
                           initialProduct = null,
                           testId = 1 // Добавляем параметр для разных ID
                       }: {
    initialAdd?: boolean,
    initialProduct?: Product | null,
    testId?: number
}) => {
    const {
        addToCart,
        items,
        total,
        itemCount,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart()

    // Добавляем начальный товар для некоторых тестов
    React.useEffect(() => {
        if (initialAdd && items.length === 0 && initialProduct) {
            addToCart(initialProduct, 2)
        }
    }, [initialAdd, items.length, addToCart, initialProduct])

    // Создаем тестовые товары с динамическими ID
    const testProduct1 = {
        id: testId,
        name: 'Test Product - 500g',
        price: 15.99,
        image: 'test.jpg',
    }

    const testProduct2 = {
        id: testId + 1, // Уникальный ID
        name: 'Second Product',
        price: 10.00,
        image: 'second.jpg',
    }

    return (
        <div>
            <button
                onClick={() => addToCart(testProduct1, 2)}
            >
                Add Item
            </button>

            <button
                onClick={() => addToCart(testProduct2, 1)}
            >
                Add Second Item
            </button>

            <button onClick={() => updateQuantity(testId, 5)}>
                Update Quantity to 5
            </button>

            <button onClick={() => updateQuantity(testId, 0)}>
                Update Quantity to 0
            </button>

            <button onClick={() => removeFromCart(testId)}>
                Remove Item
            </button>

            <button onClick={clearCart}> {/* Добавляем clearCart */}
                Clear Cart
            </button>

            <button
                onClick={() => addToCart(testProduct1, 3)}
            >
                Add Same Item Again
            </button>

            <button
                onClick={() => addToCart({
                    id: testId + 2,
                    name: 'Zero Price Product',
                    price: 0,
                    image: 'zero.jpg',
                }, 5)}
            >
                Add Zero Price Item
            </button>

            <button
                onClick={() => addToCart({
                    id: testId + 3,
                    name: 'Test Product',
                    price: 10,
                    image: 'test.jpg',
                }, 0)}
            >
                Add Zero Quantity
            </button>

            <button
                onClick={() => addToCart({
                    id: testId + 4,
                    name: 'Test Product',
                    price: 10,
                    image: 'test.jpg',
                }, -2)}
            >
                Add Negative Quantity
            </button>

            <div data-testid="item-count">{itemCount}</div>
            <div data-testid="total">{total.toFixed(2)}</div>
            <div data-testid="items-length">{items.length}</div>
            <div data-testid="items-data">{JSON.stringify(items)}</div>
        </div>
    )
}
describe('CartContext', () => {
    afterEach(() => {
        cleanup()
    })
    describe('Базовые функции', () => {
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
            expect(screen.getByTestId('total')).toHaveTextContent('31.98')
            expect(screen.getByTestId('items-length')).toHaveTextContent('1')
        })
    })

    describe('Критические тесткейсы', () => {
        it('добавление существующего товара увеличивает количество, а не создает дубликат', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            )

            // Первое добавление
            fireEvent.click(screen.getByText('Add Item'))
            expect(screen.getByTestId('items-length')).toHaveTextContent('1')
            expect(screen.getByTestId('item-count')).toHaveTextContent('2')

            // Второе добавление того же товара
            fireEvent.click(screen.getByText('Add Same Item Again'))

            // Проверяем что не создался дубликат
            expect(screen.getByTestId('items-length')).toHaveTextContent('1')
            // Проверяем что количество суммировалось: 2 + 3 = 5
            expect(screen.getByTestId('item-count')).toHaveTextContent('5')
            // Проверяем итоговую сумму: 15.99 * 5 = 79.95
            expect(screen.getByTestId('total')).toHaveTextContent('79.95')
        })

        it('корректно работает с разными товарами', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            )

            // Добавляем первый товар
            fireEvent.click(screen.getByText('Add Item'))
            // Добавляем второй товар
            fireEvent.click(screen.getByText('Add Second Item'))

            expect(screen.getByTestId('items-length')).toHaveTextContent('2')
            expect(screen.getByTestId('item-count')).toHaveTextContent('3') // 2 + 1
            expect(screen.getByTestId('total')).toHaveTextContent('41.98') // 31.98 + 10.00
        })

        it('обновление количества товара', () => {
            const testProduct = {
                id: 100,
                name: 'Test Product',
                price: 20.50,
                image: 'test.jpg',
            }

            render(
                <CartProvider>
                    <TestComponent
                        initialAdd={true}
                        initialProduct={testProduct}
                        testId={100}
                    />
                </CartProvider>
            )

            // Проверяем начальное состояние
            expect(screen.getByTestId('items-length')).toHaveTextContent('1')
            expect(screen.getByTestId('item-count')).toHaveTextContent('2')
            expect(screen.getByTestId('total')).toHaveTextContent('41.00') // 20.50 * 2

            // Обновляем количество
            fireEvent.click(screen.getByText('Update Quantity to 5'))

            expect(screen.getByTestId('item-count')).toHaveTextContent('5')
            expect(screen.getByTestId('total')).toHaveTextContent('102.50') // 20.50 * 5
        })

        it('удаление товара из корзины', async () => {
            let removeItemId: number | null = null;

            const CustomTestComponent = () => {
                const { addToCart, removeFromCart, items } = useCart();

                React.useEffect(() => {
                    const product = {
                        id: 999,
                        name: 'Test Product',
                        price: 10.00,
                        image: 'test.jpg',
                    };
                    addToCart(product, 2);
                }, []);

                // Сохраняем ID для теста
                React.useEffect(() => {
                    if (items.length > 0) {
                        removeItemId = items[0].id;
                    }
                }, [items]);

                return (
                    <div>
                        <button
                            onClick={() => removeItemId && removeFromCart(removeItemId)}
                            data-testid="custom-remove"
                        >
                            Remove
                        </button>
                        <div data-testid="items-data">{JSON.stringify(items)}</div>
                    </div>
                );
            };

            render(
                <CartProvider>
                    <CustomTestComponent />
                </CartProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('items-data')).not.toHaveTextContent('[]');
            });

            fireEvent.click(screen.getByTestId('custom-remove'));

            await waitFor(() => {
                expect(screen.getByTestId('items-data')).toHaveTextContent('[]');
            });
        });

        it('очистка всей корзины', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            )

            // Добавляем несколько товаров
            fireEvent.click(screen.getByText('Add Item'))
            fireEvent.click(screen.getByText('Add Second Item'))

            // Проверяем что товары добавились
            expect(screen.getByTestId('items-length')).toHaveTextContent('2')

            // Очищаем корзину
            fireEvent.click(screen.getByText('Clear Cart'))

            // Проверяем что корзина пуста
            expect(screen.getByTestId('items-length')).toHaveTextContent('0')
            expect(screen.getByTestId('item-count')).toHaveTextContent('0')
            expect(screen.getByTestId('total')).toHaveTextContent('0.00')
        })
    })

    describe('Пограничные случаи', () => {
        it('игнорирует добавление товара с нулевым количеством', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            )

            // Проверяем начальное состояние - должно быть 0
            expect(screen.getByTestId('items-length')).toHaveTextContent('0')

            // Пытаемся добавить с quantity=0
            fireEvent.click(screen.getByText('Add Zero Quantity'))

            // Проверяем что корзина не изменилась
            expect(screen.getByTestId('items-length')).toHaveTextContent('0')
            expect(screen.getByTestId('item-count')).toHaveTextContent('0')
        })

        it('игнорирует добавление товара с отрицательным количеством', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            )

            // Проверяем начальное состояние
            expect(screen.getByTestId('items-length')).toHaveTextContent('0')

            // Пытаемся добавить с quantity=-2
            fireEvent.click(screen.getByText('Add Negative Quantity'))

            // Проверяем что корзина не изменилась
            expect(screen.getByTestId('items-length')).toHaveTextContent('0')
            expect(screen.getByTestId('item-count')).toHaveTextContent('0')
        })


        it('обрабатывает товар с нулевой ценой', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            )

            fireEvent.click(screen.getByText('Add Zero Price Item'))

            // Товар должен добавиться
            expect(screen.getByTestId('items-length')).toHaveTextContent('1')
            expect(screen.getByTestId('item-count')).toHaveTextContent('5')
            // Но сумма должна быть 0
            expect(screen.getByTestId('total')).toHaveTextContent('0.00')
        })

        it('обновление количества на 0 удаляет товар', async () => {
            // Создаем кастомный компонент для теста
            const TestComponentForZero = () => {
                const {addToCart, updateQuantity, items} = useCart()

                React.useEffect(() => {
                    // Добавляем тестовый товар
                    addToCart({
                        id: 888,
                        name: 'Test Product',
                        price: 15.00,
                        image: 'test.jpg',
                    }, 2)
                }, [])

                const handleUpdate = () => {
                    updateQuantity(888, 0)
                }

                return (
                    <div>
                        <button onClick={handleUpdate}>Update</button>
                        <div data-testid="items-length">{items.length}</div>
                        <div data-testid="items-data">{JSON.stringify(items)}</div>
                    </div>
                )
            }

            render(
                <CartProvider>
                    <TestComponentForZero/>
                </CartProvider>
            )

            // Проверяем что товар есть
            expect(screen.getByTestId('items-length')).toHaveTextContent('1')

            // Нажимаем кнопку
            fireEvent.click(screen.getByText('Update'))

            // Проверяем что корзина пуста
            await waitFor(() => {
                expect(screen.getByTestId('items-length')).toHaveTextContent('0')
            })
        })

        it('обновление количества на отрицательное значение', async () => {
            const testProduct = {
                id: 777,
                name: 'Test Product For Negative Update',
                price: 20.00,
                image: 'test.jpg',
            }

            // Создаем кастомный компонент для этого теста
            const CustomTest = () => {
                const { addToCart, updateQuantity, items } = useCart()

                React.useEffect(() => {
                    addToCart(testProduct, 2)
                }, [])

                return (
                    <div>
                        <button onClick={() => updateQuantity(777, -1)}>
                            Update to -1
                        </button>
                        <div data-testid="items-length">{items.length}</div>
                    </div>
                )
            }

            render(
                <CartProvider>
                    <CustomTest />
                </CartProvider>
            )

            expect(screen.getByTestId('items-length')).toHaveTextContent('1')

            fireEvent.click(screen.getByText('Update to -1'))

            await waitFor(() => {
                expect(screen.getByTestId('items-length')).toHaveTextContent('0')
            })
        })
    })

    describe('Корректность вычислений', () => {
        it('правильно вычисляет общее количество товаров', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            )

            // Добавляем несколько товаров с разными количествами
            fireEvent.click(screen.getByText('Add Item')) // quantity: 2
            fireEvent.click(screen.getByText('Add Second Item')) // quantity: 1
            fireEvent.click(screen.getByText('Add Same Item Again')) // quantity: 3 к первому товару

            // Проверяем вычисления:
            // Первый товар: 2 + 3 = 5
            // Второй товар: 1
            // Общее: 5 + 1 = 6
            expect(screen.getByTestId('item-count')).toHaveTextContent('6')
        })

        it('правильно вычисляет общую сумму', () => {
            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            )

            // Добавляем товары
            fireEvent.click(screen.getByText('Add Item')) // 15.99 * 2 = 31.98
            fireEvent.click(screen.getByText('Add Second Item')) // 10.00 * 1 = 10.00
            fireEvent.click(screen.getByText('Add Same Item Again')) // 15.99 * 3 = 47.97

            // Общая сумма: 31.98 + 10.00 + 47.97 = 89.95
            expect(screen.getByTestId('total')).toHaveTextContent('89.95')
        })

        it('сохраняет данные корзины при обновлении количества', () => {
            const testProduct = {
                id: 200,
                name: 'Test Product',
                price: 20.50,
                image: 'test.jpg',
            }

            render(
                <CartProvider>
                    <TestComponent
                        initialAdd={true}
                        initialProduct={testProduct}
                        testId={200}
                    />
                </CartProvider>
            )

            // Получаем начальные данные
            const initialItems = JSON.parse(screen.getByTestId('items-data').textContent || '[]')

            // Обновляем количество
            fireEvent.click(screen.getByText('Update Quantity to 5'))

            // Получаем обновленные данные
            const updatedItems = JSON.parse(screen.getByTestId('items-data').textContent || '[]')

            // Проверяем что:
            // 1. Количество изменилось
            expect(updatedItems[0].quantity).toBe(5)
            // 2. Остальные поля остались прежними
            expect(updatedItems[0].id).toBe(initialItems[0].id)
            expect(updatedItems[0].name).toBe(initialItems[0].name)
            expect(updatedItems[0].price).toBe(initialItems[0].price)
            expect(updatedItems[0].image).toBe(initialItems[0].image)
        })
    })
})