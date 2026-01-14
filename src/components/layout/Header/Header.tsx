import React, { useState } from 'react';
import {Group, Button, Badge} from "@mantine/core";
import {IconShoppingCart} from "@tabler/icons-react";
import logo from '../../../assets/images/logo.svg'
import classes from './Header.module.css'
import { useCart } from "../../../contexts/CartContext";
import { CartPopup } from "../../ui/CartPopup/CartPopup.tsx";

export const Header: React.FC = () => {
    const { itemCount } = useCart();
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <>
        <header className={classes.header}>
            <Group>
                <Button color='#F7F7F7' radius='xl' w='209px' h='33px' p='0'>
                    <img src={logo} alt='logo'/>
                </Button>
            </Group>
            <Group>
                <Button
                    rightSection={<IconShoppingCart size={20} />}
                    variant="filled"
                    color='#54B46A'
                    radius='md'
                    size='md'
                    onClick={() => setCartOpen(true)}
                    w={144}
                    h={44}
                >
                    {itemCount > 0 && (
                    <Badge
                        circle
                        color='white'
                        c='black'
                        size='sm'
                        mr={5}
                    >
                        {itemCount}
                    </Badge>
                    )}
                    <span>Cart</span>
                </Button>
            </Group>
        </header>
        <CartPopup
            opened={cartOpen}
            onClose={() => setCartOpen(false)}/>
        </>
    )
}