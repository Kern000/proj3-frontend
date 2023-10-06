import React, {useState, createContext, useEffect} from 'react';
import APIHandler from '../api/apiHandler';

export const CartContext = createContext();

const CartContextData = ({children}) => {

    const [cartNumber, setCartNumber] = useState('');

    return (
        <CartContext.Provider value={{cartNumber, setCartNumber}}>
            {children}
        </CartContext.Provider>      
    )
}

export default CartContextData;