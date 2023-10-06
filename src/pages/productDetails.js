import '../App.css';

import React, {useState, useEffect, useContext} from 'react';
import APIHandler from '../api/apiHandler';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import {Link, useParams, useNavigate} from 'react-router-dom';
import { UserContext } from '../context/user-context';
import { CartContext } from '../context/cart-context';

export default function ProductDetails () {

    const [singleProductData, setSingleProductData] = useState();
    const [addToCartNotification, setAddToCartNotification] = useState('');
    const [cartErrorNotification, setCartErrorNotification] = useState('');

    const {userId, setUserId} = useContext(UserContext);
    const {cartNumber, setCartNumber} = useContext(CartContext);

    const retrieveProductById = async (productId) => {
        try{
            let response = await APIHandler.get(`/products/${productId}`);
            console.log('retrieving single product', response.data.product);
            setSingleProductData(response.data.product)
        } catch (error) {
            console.error('error retrieving product data', error)
        }
    }

    const {productId} = useParams();
    
    let navigate = useNavigate();

    function handleGoBack(){
        navigate(-1);   
    }

    const getCartNumber = async () => {
        try {
            console.log('frontend get cart number hit')
            let response = await APIHandler.get('/cart/assign-cart-number')
            console.log('after fetch cart number, response here=>', response.data.cartNumber)
            setCartNumber(response.data.cartNumber);

        } catch (error) {
            console.log('fail to get cart number', error)
            return;
        }
    }

    const handleLoginStateForCart = async () => {

        setCartErrorNotification('');
        setAddToCartNotification('');
        document.querySelector('#cart-add-notify').style.display = 'none'
        document.querySelector('#error-notify').style.display = 'none'

        try {

            await APIHandler.get('/users/check-login');
            console.log('checked userlogin')

            if (localStorage.getItem('userId')){
                setUserId(localStorage.getItem('userId'))
                console.log('set userId from local storage')
            }
            
            try {

                if(cartNumber===''){
                    console.log('frontend start get cart number');
                    await getCartNumber()
                }

                try{
                    const payload = {
                        "user_id": userId,
                        "cart_id": cartNumber,
                        "product_id": parseInt(productId),
                        "product_name": singleProductData.name,
                        "price": singleProductData.price,
                        "thumbnail_url": singleProductData.thumbnail_url
                    }
    
                    console.log('cart payload', payload);
    
                    await APIHandler.post(`cart/${productId}/add?userId=${userId}`, payload)
    
                    console.log('posted to cart')
    
                    setAddToCartNotification("One Item added to cart!");

                    document.querySelector('#cart-add-notify').style.display = 'flex'

                } catch (error){
                    console.log("error adding item to cart");
                    setCartErrorNotification("Error adding item to cart");
                    document.querySelector('#error-notify').style.display = 'flex'
                }

            } catch (error){
                console.log('fail to get cart Number')
                setCartErrorNotification("Error adding item to cart");
                document.querySelector('#error-notify').style.display = 'flex'
            }
        } catch (error){
            console.log('login to add cart')
            navigate('/users/login/addCart');
        }
    }

    useEffect(() => {
        retrieveProductById(productId)}
    ,[])


    return (
        <>
            <Button variant="secondary" className="ms-4 mt-2 mb-3" onClick={handleGoBack}> Back </Button>
            
            {singleProductData? (
                <Card   style=  {{    
                                    width: '90%', 
                                    maxWidth:'800px', 
                                    justifyContent:'space-evenly',
                                    marginBottom:'30px',
                                    marginLeft:'20px',
                                }}
                        className="product-details"
                >
                    <Card.Img   variant="top" src={singleProductData.image_url} 
                                style={{    maxHeight: '350px', 
                                            maxWidth: '800px', 
                                            objectFit:'contain', 
                                            border: '1px solid silver'}}                                            
                    />
                    <Card.Body>
                        
                    <Card.Title>
                        <h5> Manuscript/Book Title: </h5> 
                        {singleProductData.name} 
                    </Card.Title>
                    <Card.Text> 
                        <span style={{fontWeight:'600'}}>Content Id: </span> {singleProductData.id} 
                    </Card.Text>
                    <Card.Text> 
                        <span style={{fontWeight:'600'}}>Provided By: </span> <Link to={`/products/user/${singleProductData.user.id}`} > {singleProductData.user.name} </Link> 
                    </Card.Text>
                    <Card.Text>
                        <h5> Description: </h5>
                        {singleProductData.description}
                    </Card.Text>
                    <Card.Text> 
                        <span style={{fontWeight:'600'}}>Price: </span> {singleProductData.price} 
                    </Card.Text>
                    <Card.Text>
                        <span style={{fontWeight:'600'}}>Date created: </span> {singleProductData.date_created.slice(0,10)} 
                    </Card.Text>
                    <Card.Text>
                        <h6>Chapter Content:</h6>
                    </Card.Text>
                    <Card.Text>
                        {singleProductData.chapter_content}
                    </Card.Text>
                    
                    <Button variant="success" onClick={()=>handleLoginStateForCart()}>Add to Cart</Button>
                    </Card.Body>
                </Card>
            ) : (
                <div> Loading... </div>
            )}

            <div id='cart-add-notify' style={{      backgroundColor:'green', 
                                                    color:'white',
                                                    height:'30px',
                                                    display:'none',
                                                    justifyContent:'center',
                                                    alignItems:'center',
                                                    marginBottom:'50px',
                                                    marginTop:'0px'
                                                }}
            >
            {addToCartNotification}
            </div>
            <div id='error-notify' style={{         backgroundColor:'red', 
                                                    color:'white',
                                                    height:'30px',
                                                    display:'none',
                                                    justifyContent:'center',
                                                    alignItems:'center',
                                                    marginBottom:'50px',
                                                    marginTop: '0px'
            }}
            > {cartErrorNotification}</div>
            <div style={{height:'80px'}}>
            </div>
        </>
    )
}

