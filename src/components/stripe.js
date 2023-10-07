import React, {useState, useEffect, useContext, useRef} from 'react';
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import APIHandler from '../api/apiHandler';
import { UserContext } from '../context/user-context';
import { CartContext } from '../context/cart-context';

export default function CheckoutForm(){
    
    const {userId} = useContext(UserContext);
    const {cartNumber, cartTotalAmount} = useContext(CartContext);

    const [payload, setPayload ]= useState('');

    const userIdRef = useRef();
    const cartIdRef = useRef();

    let cartBeingCheckedOut;

    const fetchUserCart = async () => {

        console.log('userId at stripe', userId);
        console.log('userIdref stripe', userIdRef.current)
        console.log('cartId at stripe', cartNumber);
        console.log('cartIdRef stripe', cartIdRef.current)
        
        let response = await APIHandler.get(`/cart?userId=${userId || userIdRef.current}&cartId=${cartNumber || cartIdRef.current}`);
        console.log('response for cart fetch here', response.data.itemsInCart);
        cartBeingCheckedOut = response.data.itemsInCart;

        let payloadToSet=[]

        for (let cartItem of cartBeingCheckedOut){
    
            const singleItem = {
                                "quantity": cartItem.quantity,
                                "price_data":{
                                                "currency": "SGD",
                                                "unit_amount": cartItem.price,
                                                "product_data": {
                                                                    "name": cartItem.product_name,
                                                                    "metadata": {
                                                                                    'product_id': cartItem.product_id
                                                                                }
                                                                }
                                            }
            }  
    
            if (cartItem.thumbnail_url){
                singleItem.price_data.product_data.images = [cartItem.thumbnail_url]
            }           

            payloadToSet.push(singleItem);
            console.log('payload to affirm datatype', payload)
        }

        setPayload(payloadToSet);
    }


    useEffect(()=>{
        console.log('useEffect hit')
        if (userId){
            userIdRef.current = userId;
        }
        if (cartNumber){
            cartIdRef.current = cartNumber;
        }
        fetchUserCart();


    },[])

    const handleSubmit = async (event) => {

        event.preventDefault();

        
    }

    return (
        <>  
            {payload? (
                <>
                        {payload.map(item => (
                            <Card className="mb-2">
                                <Card.Header style={{backgroundColor:'greenyellow', fontWeight:'600'}}>Title: {item.price_data.product_data.name}</Card.Header>
                                <Card.Body>
                                    <Card.Text style={{display:'flex', justifyContent:'space-between'}}><span>Quantity:</span> {item.quantity} </Card.Text>
                                    <Card.Text style={{display:'flex', justifyContent:'space-between'}}><span>price:</span> {item.price_data.unit_amount} </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    <p style={{fontSize:'18px', fontWeight:'600', marginTop:'20px', marginLeft: '8px'}}>Total: ${cartTotalAmount} </p>
                </>
            ) : (<div> loading ... </div>)
            }
            <Button variant="dark">Make Payment</Button>
        </>
    )
}

