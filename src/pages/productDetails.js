import '../App.css';

import React, {useState, useEffect} from 'react';
import APIHandler from '../api/apiHandler';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import {Link, useParams, useNavigate} from 'react-router-dom';
import ProductsByUser from './productsByUser';


export default function ProductDetails () {

    const [singleProductData, setSingleProductData] = useState();

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
                        <span style={{fontWeight:'600'}}>Date created: </span> {singleProductData.date_created.slice(0,10)} 
                    </Card.Text>
                    <Card.Text>
                        <h6>Chapter Content:</h6>
                    </Card.Text>
                    <Card.Text>
                        {singleProductData.chapter_content}
                    </Card.Text>
                    
                    <Button variant="success">Add to Cart</Button>
                    </Card.Body>
                </Card>
            ) : (
                <div> Loading... </div>
            )}
        </>
    )
}

