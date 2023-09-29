import React, {useEffect, useState, useContext} from "react";
import APIHandler from "../api/apiHandler";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form'

import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../context/user-context";

export default function Dashboard (){

    const {userId, userName} = useContext(UserContext);

    const [productsData, setProductsData] = useState();
    const [errorNotification, setErrorNotification] = useState();

    let navigate = useNavigate();

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

    // const [name, setName] = useState();
    // const [price, setPrice] = useState();
    // const [description, setDescription] = useState();
    // const [image_url
    // image_url
    // thumbnail_url
    // stock
    // chapter_content
    // post category 1:free 2:webnovel 3:published 4:manuscript

    // genre 1: fantasy 2: drama 3:romance 4:comedy 5:animal
    // 6: selfhelp 7: business 8:biography 9:art 10:coding

    // add product only hv x routes , genres need update the pivot table


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
                            <Button className="ms-3 mt-1 btn-sm" variant="light" style={{border:'1px solid black'}}> List a Work </Button>
                            <Button className="ms-3 mt-1 btn-sm" variant="light" style={{border:'1px solid black'}}> Update Work </Button>                   
                            <Button className="ms-3 mt-1 btn-sm" variant="light" style={{border:'1px solid black'}}> View Cart </Button>                   
                            <Button className="ms-3 mt-1 btn-sm" variant="light" style={{border:'1px solid black'}}> View Orders </Button>                   
                        </Col>
                    </Row>
                </Container>
                {/* <Container>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="ms-4 mb-3" style={{maxWidth: '350px', minWidth:'350px', maxHeight:'60px'}}>
                            <Form.Label style={{fontSize:"12px"}}>User Name</Form.Label>
                            <Form.Control   type="text" 
                                            placeholder="Enter username"
                                            name="name"
                                            value={userName}
                                            onChange={(event) => handleRegisterUserName(event)}
                            />
                        </Form.Group>
                        <Form.Group className="ms-4 mb-3" controlId="formBasicEmail" style={{maxWidth: '350px', minWidth:'350px', maxHeight:'60px'}}>
                            <Form.Label style={{fontSize:"12px"}}>Email address</Form.Label>
                            <Form.Control   type="email" 
                                            placeholder="Enter email"
                                            name="email"
                                            value={emailAddress}
                                            onChange={(event) => handleRegisterEmail(event)}
                            />
                        </Form.Group>                    
                        <Form.Group className="ms-4 mb-3" controlId="formBasicPassword" style={{maxWidth: '350px', minWidth:'300px', maxHeight:'60px'}}>
                            <Form.Label style={{fontSize:"12px"}}>Password</Form.Label>
                            <Form.Control   type="password"
                                            name="password"
                                            placeholder="Password" 
                                            value={password}
                                            onChange={(event) => handleRegisterPassword(event)}
                            />
                        </Form.Group>
                        <Form.Group className="ms-4 mb-3" controlId="formBasicPassword" style={{maxWidth: '350px', minWidth:'300px', maxHeight:'60px'}}>
                            <Form.Label style={{fontSize:"12px"}}>Confirm Password</Form.Label>
                            <Form.Control   type="password"
                                            name="password"
                                            placeholder="Confirm Password" 
                                            value={confirmPassword}
                                            onChange={(event) => handleRegisterConfirmPassword(event)}
                            />
                        </Form.Group>
                        <Form.Group className="ms-4 mb-3" style={{maxWidth: '350px', minWidth:'350px', maxHeight:'60px'}}>
                            <Form.Label style={{fontSize:"12px"}}>What is the name of your first school?</Form.Label>
                            <Form.Control   type="text"
                                            placeholder="Enter secret"
                                            name="secret"
                                            value={secret}
                                            onChange={(event) => handleRegisterSecret(event)}
                            />
                        </Form.Group>
                        <Form.Group className="ms-4 mb-3">
                            <Form.Text className="text-muted" style={{fontSize:"12px"}}>
                                Existing user? <Link to="/users/login"> Login </Link>
                            </Form.Text>
                        </Form.Group>
                        
                        {/* <input type="hidden" name="_csrf" value={csrfToken} /> */}
                        {/* <Button variant="secondary" className="ms-4" type="submit">
                            Submit
                        </Button>
                        <Form.Text className="text-muted mt-3 ms-4">
                            {errorNotification}
                        </Form.Text>
                    </Form>
                </Container> */}
        </>
    )
}