import React, {useState, createContext, useEffect} from 'react';
import APIHandler from '../api/apiHandler';

export const CartContext = createContext();

const CartContextData = ({children}) => {

    const [productsInCart, setProductsInCart] = useState('')
    const [cartNumber, setCartNumber] = useState('')

    const getCartNumber = async () => {
        try {
            let response = await APIHandler.get('/assign-cart-number')
            setCartNumber(response.data.cartNumber);
            console.log('cart number here', cartNumber)
        } catch (error) {
            console.log('fail to get cart number', error)
        }
    }

    useEffect(()=>{
        getCartNumber()
    }, [])

    return (
        <CartContext.Provider value={{productsInCart, setProductsInCart, cartNumber, setCartNumber}}>
            {children}
        </CartContext.Provider>      
    )
}

export default CartContextData;