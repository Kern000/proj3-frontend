import React, {useState, useEffect, useContext, useRef} from 'react';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/Card';
import APIHandler, { APIHandlerForStripe } from '../api/apiHandler';
import { UserContext } from '../context/user-context';
import { CartContext } from '../context/cart-context';

export default function CheckoutForm(){
    
    const {userId, setUserId} = useContext(UserContext);
    const {cartNumber, cartTotalAmount} = useContext(CartContext);
    const [notification, setNotification] = useState('')

    const [payload, setPayload] = useState('');
    const [payloadForOrders, setPayloadForOrders] = useState('');

    const userIdRef = useRef();
    const cartIdRef = useRef();

    let cartBeingCheckedOut;

    const fetchUserCart = async () => {
       
        let response = await APIHandler.get(`/cart?userId=${userId || userIdRef.current}&cartId=${cartNumber || cartIdRef.current}`);
        console.log('response for cart fetch here', response.data.itemsInCart);
        cartBeingCheckedOut = response.data.itemsInCart;

        setPayloadForOrders(cartBeingCheckedOut);

        let payloadToSet=[]

        for (let cartItem of cartBeingCheckedOut){
    
            const singleItem = {
                                "quantity": cartItem.quantity,
                                "price_data":{
                                                "currency": "SGD",
                                                "unit_amount": cartItem.price*100,
                                                "product_data": {
                                                                    "name": cartItem.product_name,
                                                                    "metadata": {
                                                                                    'product_id': cartItem.product_id,
                                                                                }
                                                                }
                                            }
            }
    
            if (cartItem.thumbnail_url){
                singleItem.price_data.product_data.images = [cartItem.thumbnail_url]
            }

            payloadToSet.push(singleItem);
            console.log('payload to affirm datatype', payloadToSet)
        }

        setPayload(payloadToSet);
    }


    useEffect(()=>{
        console.log('useEffect hit')
        if (localStorage.getItem('userId')){
            setUserId(localStorage.getItem('userId'));
        }
        if (userId){
            userIdRef.current = userId;
        }
        if (cartNumber){
            cartIdRef.current = cartNumber;
        }
        fetchUserCart();
    },[])

    const handleSubmit = async (event) => {

        setNotification('');

        try{
            console.log('cartbeingcheckedout', payloadForOrders);

            let response = await APIHandler.post(`/orders/checkout?userId=${userId}`, payloadForOrders);
            
            let orderId = response.data.order_id

            try{
                let response = await APIHandlerForStripe.post(`/checkout?orderId=${orderId}`, payload);
                let paymentUrl = response.data.paymentUrl;
                window.open(paymentUrl, "_blank");
                
            } catch (error){
                setNotification("Error procesing stripe payment, try again later");
                return;
            }

        } catch (error) {
            console.log('Order submission error', error);
            setNotification("Error submitting order, try again later");
        }
    }

    return (
        <>  
            {notification? (<div style={{backgroundColor: 'gray', color:'white', display:'flex', justifyContent:'center', fontSize: '15px'}}>{notification}</div>):(null)}
            {payload? (
                <>
                        {payload.map(item => (
                            <Card className="mb-2">
                                <Card.Header style={{backgroundColor:'greenyellow', fontWeight:'600'}}>Title: {item.price_data.product_data.name}</Card.Header>
                                <Card.Body>
                                    <Card.Text style={{display:'flex', justifyContent:'space-between'}}><span>Quantity:</span> {item.quantity} </Card.Text>
                                    <Card.Text style={{display:'flex', justifyContent:'space-between'}}><span>price:</span> {item.price_data.unit_amount / 100} </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    <p style={{fontSize:'18px', fontWeight:'600', marginTop:'20px', marginLeft: '8px'}}>Total: ${cartTotalAmount} </p>
                </>
            ) : (<div> loading ... </div>)
            }
            <Button variant="dark" onClick={()=>handleSubmit()}>Make Payment</Button>
        </>
    )
}

