import React, {useEffect, useState} from "react";
import APIHandler from "../api/apiHandler";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import ProductDetails from "./productDetails";

import { Link, useParams, useNavigate } from 'react-router-dom';

export default function ProductsByUser (){

    const [productsData, setProductsData] = useState();

    const {userId} = useParams();

    let navigate = useNavigate();

    function handleGoBack(){
        navigate(-1);   
    }

    const retrieveUserProducts = async () => {
        try{
            let response = await APIHandler.get(`/products/user/${userId}`);
            console.log('retrieving products by user', response.data);
            return response.data.products;
        } catch(error) {
            console.error("fail to retrieve user products", error)
        }
    }
    
    useEffect(() => {
        console.log('useEffect hit');
        retrieveUserProducts().then((data)=>{
            console.log('Received data from promise', data);
            setProductsData(data);
        }).then(console.log('This is products Data structure', productsData))
    },[])

    return (
        <>
        { productsData? (
        <body>
            <Button variant="secondary" className="ms-3 mt-2 mb-3" onClick={handleGoBack}> Back </Button>

            <h4 className="ms-3">Works by user: {productsData[0].user.name}</h4>
            <Container fluid>
                <Row xs={1} s={2} md={2} lg={3} xl={4} xxl={5} style={{justifyContent:'space-evenly'}}>
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
        ) : (
            <div> Loading... </div>
        )
        }
        </>
    )
}