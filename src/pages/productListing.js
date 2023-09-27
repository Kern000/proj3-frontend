import React, {useEffect, useState} from "react";
import APIHandler from "../api/apiHandler";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import ProductDetails from "./productDetails";

import { Link } from 'react-router-dom';

export default function ProductListing (){

    const [productsData, setProductsData] = useState();
 
    const retrieveAllProducts = async () => {
        let response = await APIHandler.get('/products');
        console.log('retrieving products', response.data);
        return response.data.products;
    }
    
    useEffect(() => {
        retrieveAllProducts().then((data)=>{
            console.log('Received data from promise', data);
            setProductsData(data);
        })
    },[])

    return (
        <>
        {productsData? (
        <body>
            <h4 className="ms-3">Latest Works</h4>
            <Container fluid>
                <Row xs={1} s={2} md={2} lg={3} xl={4} xxl={5} style={{justifyContent:'flex-start'}}>
                    {productsData.map(product =>  
                        <Col style={{marginLeft:'0px'}}>
                            <Card style={{ width: '18rem', marginTop: '10px', marginBottom:'20px'}}>
                            <Card.Img variant="top" src={product.image_url} style={{ minHeight: '220px', maxHeight:'220px'}}/>
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>
                                {product.description}
                                </Card.Text>
                                    <Link to={`/products/${product.id}`} element={<ProductDetails />}>
                                        <Button variant="dark"> See Details </Button>
                                    </Link>
                            </Card.Body>
                            </Card>             
                        </Col>
                    )}
                </Row>

            </Container>
        </body>
        ) : (<div> Loading... </div>)
        }
        </>
    )
}