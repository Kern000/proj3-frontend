import React, {useEffect, useState, useContext} from "react";
import APIHandler from "../api/apiHandler";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import AddProductForm from "../components/add-product";
import UpdateProductForm from "../components/update-product";

import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../context/user-context";

export default function Dashboard (){

    const {userId, userName} = useContext(UserContext);

    const [productsData, setProductsData] = useState();
    const [errorNotification, setErrorNotification] = useState();
    const [showItem, setShowItem] = useState();

    let navigate = useNavigate();

    const handleToggleButton = (event) => {
        if (showItem === event.target.value) {
            setShowItem('')
        } else {
            setShowItem(event.target.value)
        }
    }

    function handleGoBack(){
        navigate(-1);   
    }

    const retrieveUserProducts = async () => {

        try {
            let response = await APIHandler.get(`/users/dashboard/${userId}`);
    
            console.log('retrieving products by user', response.data);
                  
            return response.data.products;
        } catch (error) {
            setErrorNotification('Products not found')
        }
    }

    useEffect(() => {
        console.log('useEffect hit', userId, userName);
        if (userId && userName){
            retrieveUserProducts().then((data)=>{
                console.log('Received data from promise', data);
                setProductsData(data);
            }).then(console.log('This is products Data structure', productsData))
        }
    },
    [userId, userName])


    return (
        <>
            <div className="ms-3 mb-4">
                {errorNotification}
            </div>

            <div style={{display:"flex", alignContent:"center"}}>
                <Button variant="dark" className="ms-3 mb-2" onClick={handleGoBack}> Back </Button>
                <span className="mt-2 ms-4">Welcome: <span style={{color:'slateblue'}}> {userName? userName : ''} </span></span>
            </div>
            
            <div className="ms-3 mt-1 mb-3" style={{width:'96%', borderBottom:"1px solid black"}}> </div>


            <Card className="ms-3" style={{width:'96%'}}>
                <Card.Header as="h5" style={{backgroundColor:'white'}}> Your Works</Card.Header>
                    <Card.Body>
                        {productsData?
                            (<Container fluid className="mt-2 mb-5">
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
                                                    <Link to={`/products/${product.id}`} >
                                                        <Button variant="dark"> See Details </Button>
                                                    </Link>
                                                    <Link to={`/products/${product.id}`} >
                                                        <Button variant="secondary"> Update </Button>
                                                    </Link>
                                            </Card.Body>
                                            </Card>             
                                        </Col>
                                    )}
                                </Row>
                            </Container>
                        ) : (<div className="ms-1 mt-3 mb-4" style={{color:'gray'}}> No Products Found </div>)
                        }
                    </Card.Body>
                </Card>
                <div className="ms-3 mt-3 mb-3" style={{width:'96%', borderBottom:"1px solid black"}}> </div>
                <Container fluid>
                    <Row>
                        <Col style={{maxWidth:'100px'}}>
                            <span className="ms-4" style={{color:'black', fontWeight:'600', fontSize:'20px'}}>Tools</span>
                        </Col>
                        <Col style={{justifyContent:'flex-start'}}>
                            <Button className="ms-3 mt-1 btn-sm" 
                                    variant="light" 
                                    style={{border:'1px solid black'}}
                                    value="addProduct"
                                    onClick={(event)=>handleToggleButton(event)}
                            > List a Work </Button>

                            <Button className="ms-3 mt-1 btn-sm" 
                                    variant="light" 
                                    style={{border:'1px solid black'}}
                                    value="viewCart"
                                    onClick={(event)=>handleToggleButton(event)}
                            > View Cart </Button>                   
                            
                            <Button className="ms-3 mt-1 btn-sm" 
                                    variant="light" 
                                    style={{border:'1px solid black'}}
                                    value="viewOrders"
                                    onClick={(event)=>handleToggleButton(event)}
                            > View Orders </Button>                   
                        </Col>
                    </Row>
                </Container>
                {
                    showItem == "addProduct"?
                    (
                        <Container fluid className="ms-3">
                            <AddProductForm />
                        </Container>
                    ): (
                        <Container fluid className="ms-3">
                        </Container>
                    )
                }
                {
                    showItem == "viewCart"?
                    (
                        <Container fluid className="ms-3">
                            <AddProductForm />
                        </Container>
                    ): (
                        <Container fluid className="ms-3">
                        </Container>
                    )
                }
                {
                    showItem == "viewOrders"?
                    (   
                        <Container fluid className="ms-3">
                            <AddProductForm />
                        </Container>
                    ): (
                        <Container fluid className="ms-3">
                        </Container>
                    )
                }
        </>
    )
}
