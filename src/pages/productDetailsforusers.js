import '../App.css';

import React, {useState, useEffect, useContext, useRef} from 'react';
import APIHandler from '../api/apiHandler';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import {Link, useParams, useNavigate} from 'react-router-dom';

import { UserContext } from '../context/user-context';

export default function ProductDetailsForDashBoard () {

    const [singleProductData, setSingleProductData] = useState();
    
    const {userId, setUserId} = useContext(UserContext);

    const {productId} = useParams();
    
    let navigate = useNavigate();

    function handleGoBack(){
        navigate(-1);   
    }

    const userIdRef = useRef(userId);

    const retrieveProductById = async (productId) => {
        try{
            let response = await APIHandler.get(`/users/${productId}/products?userId=${userId || userIdRef.current}`);
            console.log('retrieving single product', response.data.product);
            setSingleProductData(response.data.product)
        } catch (error) {
            console.error('error retrieving product data', error)
        }
    }

    useEffect(() => {
        if (localStorage.getItem('userId')){
            setUserId(localStorage.getItem('userId'))
        }
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
                        <h6> Description: </h6>
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
                    <Link to={`/users/${singleProductData.id}/update`} >
                        <Button variant="secondary">Update Item</Button>
                    </ Link>
                    <Button variant="danger" className="ms-3">Delete Item</Button>
                    <Button variant="success" className="ms-3">Add to Cart</Button>
                    </Card.Body>
                </Card>
            ) : (
                <div className="ms-4"> Loading... </div>
            )}
        </>
    )
}

