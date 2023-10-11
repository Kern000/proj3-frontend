import React, {useEffect, useState, useContext, useRef} from "react";
import APIHandler from "../api/apiHandler";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { Link } from "react-router-dom";

import { UserContext } from "../context/user-context";
import { CartContext } from '../context/cart-context'

import CheckoutForm from "./checkout";

export default function Cart (){

    const {userId, setUserId} = useContext(UserContext);
    const {cartNumber, cartTotalAmount, setCartTotalAmount} = useContext(CartContext);

    const [itemsInCart, setItemsInCart] = useState('');
    const [errorNotification, setErrorNotification] = useState('');
    const [cartError, setCartError] = useState('');
    const [cartSuccess, setCartSuccess] = useState('');

    const [showCheckOut, setShowCheckOut] = useState(false);
    const handleCloseCheckOut = () => setShowCheckOut(false);  

    const [reRender, setReRender] = useState(false);

    let userIdRef = useRef(userId);
    let cartItems;

    const retrieveCartItems = async () => {
        try {
            console.log('userId', userId)
            console.log('cartNumber', cartNumber)
            let response = await APIHandler.get(`/cart?userId=${userId || userIdRef.current}&cartId=${cartNumber}`);
            let itemsWithQuantityInDb = response.data.itemsInCart.map(item => ({...item, quantityInDb: item.quantity}))
            console.log('retrieved cart items', itemsWithQuantityInDb);
            setItemsInCart(itemsWithQuantityInDb);

            cartItems = itemsWithQuantityInDb;

            const totalCalculator = () => {
        
                let cartTotal = cartItems.reduce((sum, item) => {
                    return sum + item.price * item.quantityInDb;
                }, 0)
        
                console.log('cart total here =>', cartTotal);
                setCartTotalAmount(cartTotal)
            }
            
            totalCalculator();

        } catch (error) {
            setErrorNotification('No items in cart');
        }
    }

    useEffect(() => {

        if (localStorage.getItem("userId")){
            setUserId(localStorage.getItem("userId"));
        }

        if (userId){
            userIdRef.current = userId;
    
            retrieveCartItems()

            if (!itemsInCart){
                setErrorNotification('No items in cart');
            }
            console.log('This is cart Data structure', itemsInCart)
        }
    },
    [reRender])

    const handleChangeQuantity = (event) => {

        console.log('event.target.value here', event.target.value)
        console.log('event.target.id here', event.target.id)

        const eventId = parseInt(event.target.id)

        let duplicate = [...itemsInCart]

        const indexOfItemToChange = duplicate.findIndex((item) => item.id === eventId);
        const left = duplicate.slice(0, indexOfItemToChange);
        const right = duplicate.slice(indexOfItemToChange+1)
        let updateItem = duplicate[indexOfItemToChange];
        console.log('item to update', updateItem)

        updateItem.quantity = parseInt(event.target.value)
        const updatedList = [...left, updateItem, ...right]

        console.log('updates here', updatedList)

        setItemsInCart(updatedList);
    }

    const handleDeleteSubmit = async (event) => {

        setCartError('');
        setCartSuccess('');
        
        let productId = event.target.id
        try{
            await APIHandler.post(`/cart/deleteItem?userId=${userId}&cartId=${cartNumber}&productId=${productId}`)
            setReRender(!reRender);
        } catch (error) {
            setCartError("Fail to delete item")
        }
    }

    const handleUpdatesubmit = async (event) => {

        setCartError('');
        setCartSuccess('');

        let productId = parseInt(event.target.id);
        console.log('product id here', productId)

        let duplicate = [...itemsInCart]
        let indexOfItemToChange = duplicate.findIndex(item => item.product_id === productId)
        let itemToChange = duplicate[indexOfItemToChange]

        let payload={'quantity': itemToChange.quantity}

        console.log('handle submit payload is here', payload);

        try{
            await APIHandler.post(`/cart/update-qty?userId=${userId}&cartId=${cartNumber}&productId=${productId}`, payload)
            setCartSuccess('Successful update of quantities')
            setTimeout(()=> setReRender(!reRender),500)
        } catch (error) {
            setCartError('Fail to update quantities');
        }
    }

    return (
        <>
            <Card className="ms-3 mt-4" style={{width:'96%'}}>
                <Card.Header as="h5" 
                            style={{backgroundColor:'limegreen', color: 'white', display:'flex', justifyContent:'space-between', alignItems:'center'}}
                >
                    Items in Cart
                    <div>
                        {cartTotalAmount? (<span>Cart Total: ${cartTotalAmount}</span>) : (null)}
                        <Button className="btn-md ms-4"
                                variant="success"
                                style={{fontSize:'14px'}}
                                onClick={()=>setShowCheckOut(true)}
                        >
                            Cart Checkout
                        </Button>
                    </div>
                </Card.Header>
                    <Card.Body className="mb-0 pb-0">
                        {cartError? (<div style={{backgroundColor:'red', color:'white', display:'flex', justifyContent:'center'}} className="ms-2"> {cartError} </div>) : null }
                        {cartSuccess? (<div style={{backgroundColor:'green', color:'white', display:'flex', justifyContent:'center'}} className="ms-2"> {cartSuccess} </div>) : null }

                        {itemsInCart?
                            (<Container fluid className="mt-2 mb-3 pb-0">
                                <Row xs={2} s={3} md={4} lg={5} xl={6} xxl={7} style={{justifyContent:'flex-start'}}>
                                    {itemsInCart.map(cartItem => 
                                        <Col style={{marginLeft:'0px'}}>
                                            <Card style={{ width: '10rem', height:'330px', marginTop: '10px'}}>
                                            <Card.Img variant="top" src={cartItem.thumbnail_url} style={{ minHeight: '120px', maxHeight:'120px'}}/>
                                            <Card.Body className="mb-0 pb-0">
                                                <Card.Title style={{fontSize:'13px', overflow:'hidden', height:'30px'}}>Title: {cartItem.product_name}</Card.Title>
                                                <Card.Text style={{fontSize:'13px'}}>
                                                Price: $ {cartItem.price}<br />
                                                Qty: {cartItem.quantityInDb}

                                                <div className="mt-1 mb-0" style={{display:'flex', alignContent:'center'}}>
                                                New Qty:
                                                    <input  className='ms-2'
                                                            type='number'
                                                            value={cartItem.quantity}
                                                            id={cartItem.id}
                                                            style={{height:'20px', width:'50px'}}
                                                            onChange={(event)=>handleChangeQuantity(event)}
                                                    ></input>
                                                </div>
                                                <Button variant="secondary" 
                                                            className="mt-3 btn-sm" 
                                                            style={{fontSize:'9px', width:'110px'}}
                                                            id={cartItem.product_id}
                                                            onClick={(event)=>handleUpdatesubmit(event)}
                                                    > Update Qty
                                                    </Button>
                                                </Card.Text>
                                                <Link to={`/products/${cartItem.product_id}`}>
                                                    <Button variant="warning" className="btn-sm" style={{fontSize:'10px'}}>Details</Button>
                                                </Link>
                                                <Button variant='dark' 
                                                        className="btn-sm ms-3" 
                                                        style={{fontSize:'10px'}}
                                                        id={cartItem.product_id}
                                                        onClick={(event)=>handleDeleteSubmit(event)}
                                                        >Delete</Button>
                                            </Card.Body>
                                            </Card>             
                                        </Col>
                                    )}
                                </Row>
                            </Container>
                        ) : (<div className="ms-1 mt-3 mb-4" style={{color:'gray'}}> {errorNotification} </div>)                    }                        
                    </Card.Body>
            </Card>
 
        <Offcanvas show={showCheckOut} placement={'end'} onHide={()=>handleCloseCheckOut()}>
            <Offcanvas.Header closeButton>
            <Offcanvas.Title> Checkout at Stripe</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <CheckoutForm />
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}