import './App.css'
import { Header } from './components/layout/Header/Header'
import '@mantine/core/styles.css'
import { MantineProvider, Container, SimpleGrid, Loader } from '@mantine/core';
import { ProductCard } from "./components/ui/ProductCard/ProductCard";
import { Product } from "./types/product";
import { useState, useEffect } from "react";
import { fetchProducts } from "./services/api.ts";

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                setError('Failed to load products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return (
        <MantineProvider>
            <Header />
            <Container size={1440} bg='#F3F5FA' p={80} pt={20}>
                <h1 data-testid="catalog-title">Catalog</h1>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg" data-testid="products-grid">
                    {loading ? (
                        // Показываем 12 лоадеров-карточек
                        Array.from({ length: 12 }).map((_, index) => (
                            <div
                                key={index}
                                data-testid="loading-card"
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    height: '380px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #eaeaea'
                                }}
                            >
                                <Loader color="green" size="lg" data-testid="loader" />
                            </div>
                        ))
                    ) : error ? (
                        <div
                            data-testid="error-message"
                            style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '40px'
                            }}
                        >
                            Error: {error}
                        </div>
                    ) : (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </SimpleGrid>
            </Container>
        </MantineProvider>
    )
}

export default App
