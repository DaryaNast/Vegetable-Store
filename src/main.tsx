import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { CartProvider} from "./contexts/CartContext.tsx";
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CartProvider>
            <MantineProvider>
                <App />
            </MantineProvider>
        </CartProvider>
    </React.StrictMode>
)