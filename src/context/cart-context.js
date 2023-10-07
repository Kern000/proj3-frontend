import React, {useState, createContext, useEffect} from 'react';
import APIHandler from '../api/apiHandler';

export const CartContext = createContext();

const CartContextData = ({children}) => {

    const [cartNumber, setCartNumber] = useState('');
    const [cartTotalAmount, setCartTotalAmount] = useState('');

    return (
        <CartContext.Provider value={{cartNumber, setCartNumber, cartTotalAmount, setCartTotalAmount}}>
            {children}
        </CartContext.Provider>      
    )
}

export default CartContextData;