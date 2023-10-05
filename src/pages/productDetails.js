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
    const [addToCartNotification, setAddToCartNotification] = useState();

    const {userId, setUserId} = useContext(UserContext);
    const {productsInCart, setProductsInCart, cartNumber} = useContext(CartContext);

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

    const handleLoginStateForCart = async () => {
        try {
            await APIHandler.get('/users/check-login');
            console.log('jwt still in play')

            if (localStorage.getItem('userId')){
                setUserId(localStorage.getItem('userId'))
            }

            // pending cart Number assignment and payload creation and post to add to cart
            await APIHandler.post('')

            setAddToCartNotification("One Item added to cart!")

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
            {addToCartNotification? 
                (<div style={{backgroundColor:'green', color:'brown'}}> {addToCartNotification}</div>) 
                : null
            }
            {singleProductData? (
                <Card   style=  {{    
                                    width: '90%', 
                                    maxWidth:'800px', 
                                    justifyContent:'space-evenly',
                                    marginBottom:'60px',
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
        </>
    )
}

