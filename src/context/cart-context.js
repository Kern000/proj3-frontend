import React, {useState, createContext, useMemo} from 'react';

export const CartContext = createContext();

const CartContextData = ({children}) => {

    const [productsInCart, setProductsInCart] = useState('')

    const contextValue = useMemo(()=>{
        return({
            productsInCart, setProductsInCart
        })
    },  [
            productsInCart, setProductsInCart
        ]
    )

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>      
    )
}

export default CartContextData;