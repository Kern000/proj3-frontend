import React, {useEffect, useState} from "react";
import APIHandler from "../api/apiHandler";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function ProductListing (){

    const [productsData, setProductsData] = useState([]);

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
        <Container>
            <Row xs={1} md={2} lg={3} xl={4} xxl={6}>
                {productsData.map(product =>  
                    <Col>
                        <h4>{product.id}</h4>
                        <h4>{product.name}</h4>
                        <h6>{product.price}</h6>
                        <img src={product.thumbnail_url}/>              
                    </Col>
                )}
            </Row>
        </Container>
    )
}