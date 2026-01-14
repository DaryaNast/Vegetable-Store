import React from 'react'
import { Button, Group, Modal, Stack, Text, Image, ActionIcon } from "@mantine/core";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { useCart } from "../../../contexts/CartContext.tsx";
import cart from '../../../assets/images/cart_empty.svg'
import classes from "./CartPopup.module.css"

interface CartPopupProps {
    opened: boolean;
    onClose: () => void;
}

export const CartPopup: React.FC<CartPopupProps> = ({ opened, onClose }) => {
    const { items, total, updateQuantity, removeFromCart } = useCart();

    if (items.length === 0) {
        return (
            <Modal
                opened={opened}
                onClose={onClose}
                size="xs"
                radius="md"
                className={classes.modal}
                transitionProps={{ transition: 'slide-left', duration: 300 }}
                styles={{
                    content: {
                        margin: 0,
                        position: 'absolute',
                        top: 70,
                        right: 20,
                        height: '300px',
                        width: '300px',
                        borderRadius: 16,
                    }
                }}
            >
                <Stack align='center' py='xl'>
                    <Image src={cart} w={118} h={106} />
                    <Text size="lg" c="dimmed">Your cart is empty :(</Text>
                </Stack>
            </Modal>
        )
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size='lg'
            transitionProps={{ transition: 'slide-left', duration: 300 }}
            styles={{
                content: {
                    margin: 0,
                    position: 'absolute',
                    top: 70,
                    right: 20,
                    width: '444px',
                    borderRadius: 16,
                    overflowY: 'auto',
                }
            }}
        >
            <Stack gap='md'>
                {items.map((item) => {
                    const nameParts = item.name.split('-');
                    const name = nameParts[0]?.trim() || item.name;
                    const weight = nameParts[1]?.trim() || '';

                    return (
                        <Group key={item.id} justify='space-between' align="flex-start">
                            <Group gap='md' wrap='nowrap'>
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={60}
                                    height={60}
                                    radius='md'
                                />
                                <div>
                                    <Text fw={600} size='md'>{name}</Text>
                                    {weight && (
                                        <Text fw={600} size='sm' c='#868E96' ff='Open Sans'>
                                            {weight}
                                        </Text>
                                    )}
                                    <Text fw={600} mt={4}>${(item.price * item.quantity).toFixed(2)}</Text>
                                </div>
                            </Group>
                            <Group gap='xs' align="center">
                                <Button
                                    variant="light"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    color='#DEE2E6'
                                    radius='md'
                                    h={30}
                                    w={30}
                                    p={0}
                                >
                                    <IconMinus size={12} color='black' />
                                </Button>
                                <Text fw={500} px={8}>
                                    {item.quantity}
                                </Text>
                                <Button
                                    variant="light"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    color='#DEE2E6'
                                    radius='md'
                                    h={30}
                                    w={30}
                                    p={0}
                                >
                                    <IconPlus size={12} color='black' />
                                </Button>
                                <ActionIcon
                                    color='red'
                                    variant='subtle'
                                    onClick={() => removeFromCart(item.id)}
                                    size="sm"
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                        </Group>
                    );
                })}

                <Group justify="space-between" mt="xl" pt="md" style={{ borderTop: '1px solid #eaeaea' }}>
                    <Text fw={700} size="xl">Total:</Text>
                    <Text fw={700} size="xl">${total.toFixed(2)}</Text>
                </Group>
            </Stack>
        </Modal>
    )
}