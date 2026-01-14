import React from 'react';
import { Product } from "../../../types/product";
import {IconShoppingCart, IconMinus, IconPlus} from "@tabler/icons-react";
import {Button, Card, Image, Text, Group } from "@mantine/core";
import classes from "./ProductCard.module.css";
import { useCart} from "../../../contexts/CartContext.tsx";

interface ProductCardProps {
    product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const name = product.name.split('-')[0].trim();
    const weight = product.name.split('-')[1];
    const [quantity, setQuantity] = React.useState(1);

    const { addToCart } = useCart();

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    }

    const handleDecrement = () => {
        setQuantity(Math.max(1, quantity - 1));
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setQuantity(1);
    };

    return (
        <Card shadow='xs' padding='lg' radius='lg' withBorder className={classes.card} >
            <Card.Section>
                <Image
                    src={product.image}
                    alt={name}
                    height={276}
                    width={276}
                    fit='contain'
                />
            </Card.Section>

            <Group justify="space-between" mt="xs">
                <Group m={0}>
                    <Text fw={600} size='md' ta='start' >{name} </Text>
                    <Text fw={600} size='sm' ta='start' c='#868E96' ff='Open Sans' >{weight}</Text>
                </Group>
                <Group>
                    <Button
                        variant="light"
                        size="sm"
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        color='#DEE2E6'
                        radius='md'
                        h={30}
                        w={30}
                        p={0}
                    >
                        <IconMinus size={12} color='black'/>
                    </Button>
                    <Text fw={500}>
                        {quantity}
                    </Text>
                    <Button
                        variant="light"
                        size="xs"
                        onClick={handleIncrement}
                        color='#DEE2E6'
                        radius='md'
                        h={30}
                        w={30}
                        p={0}
                    >
                        <IconPlus size={12} color='black' />
                    </Button>
                </Group>
            </Group>

            <Group mt="xs" m={0} justify='space-between'>
                <Text size='xl' fw={700} ta='justify'>$ {product.price}</Text>

                <Button
                    className={classes.addButton}
                    rightSection={<IconShoppingCart size={20} />}
                    variant="light"
                    color='green'
                    radius='md'
                    onClick={handleAddToCart}
                    w={192}
                    h={44}
                    p={0}
                >
                    Add to cart
                </Button>
            </Group>
        </Card>
    )
}