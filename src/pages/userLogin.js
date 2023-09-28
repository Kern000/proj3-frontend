import React, {useContext, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

import { UserContext } from '../context/user-context';
import { Link, useNavigate } from 'react-router-dom';

import APIHandler, { setAuthHeader } from '../api/apiHandler';

export default function UserLogin (){

    // context
    const {userName, setUserName} = useContext(UserContext);
    const {userId, setUserId} = useContext(UserContext);

    // state
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const [errorNotification, setErrorNotification] = useState('');

    // navigate
    let navigate = useNavigate();

    function handleGoBack(){
        navigate(-1);   
    }

    // Data
    const handleLoginEmail = (event) => {
        setErrorNotification('');
        setEmailAddress(event.target.value);
    }

    const handlePassword = (event) => {
        setErrorNotification('');
        setPassword(event.target.value);
    }

    const navigateToDashBoard = (userId) => {
        navigate(`/users/dashboard/${userId}`)
    }

    // csrf
    // const fetchToken = async () => {
    //     const response = await APIHandler.get('/get-csrf')
    //     setCSRF(response.data.csrf)
    // }

    // const csrfToken = localStorage.getItem('csrfToken');
    
    // useEffect(() => {
    //     fetchToken()
    // },[])

    const handleSubmit = async (event) => {

        event.preventDefault();

        const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const passwordRegexPattern = /^[a-zA-Z0-9._%+\-!@#$&*()]*$/i;

        if (emailAddress === "" && password ===""){
            setErrorNotification('Fields cannot empty')
        }
        else if (emailAddress === ""){
            setErrorNotification('Email cannot be empty')
        }
        else if (password === ""){
            setErrorNotification('password cannot be empty')
        }
        else if (!emailRegexPattern.test(emailAddress)){
            setErrorNotification('invalid email characters or format')
        }
        else if (!passwordRegexPattern.test(password)){
            setErrorNotification('Invalid password')
        }
        else {

            console.log('Login response incoming')


            // console.log(csrfToken)

            try {
                console.log('try route hit in login handle submit')

                let loginResponse = await APIHandler.post('/users/login', {
                    "email": emailAddress,
                    "password": password,
                })

                let accessToken = await loginResponse.data.accessToken
                let refreshToken = await loginResponse.data.refreshToken
                
                console.log('access token react =>', accessToken)
                console.log('refresh token react =>', refreshToken)

                setUserId(await loginResponse.data.userId)
                setUserName(await loginResponse.data.userName)
                
                console.log('react user id =>', userId)
                console.log('react user name =>', userName)

                setAuthHeader(accessToken, refreshToken)

                if (userId){
                    navigateToDashBoard(userId);
                }
            } catch (error) {
                console.log('Invalid login', error)
                setErrorNotification('Invalid Log in')
            }
        }
    }

    return (
        <>
            <Container fluid style={{display: 'flex', justifyContent: 'center', maxHeight: "80vh", overflow:'hidden'}}>
                <Row xs={1} s={1} md={2} lg={2} xl={2} xxl={2} style={{maxHeight:'100%'}}>
                    <Col>
                        <Button variant="secondary" className="ms-4 mt-2 mb-3" onClick={handleGoBack}> Back </Button>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="ms-4 mb-3" controlId="formBasicEmail" style={{maxWidth: '350px', minWidth:'350px'}}>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control   type="email" 
                                                placeholder="Enter email"
                                                name="email"
                                                value={emailAddress}
                                                onChange={(event) => handleLoginEmail(event)}
                                />
                            </Form.Group>                    
                            <Form.Group className="ms-4 mb-3" controlId="formBasicPassword" style={{maxWidth: '350px', minWidth:'300px'}}>
                                <Form.Label>Password</Form.Label>
                                <Form.Control   type="password"
                                                name="password"
                                                placeholder="Password" 
                                                value={password}
                                                onChange={(event) => handlePassword(event)}
                                />
                            </Form.Group>
                            <Form.Group className="ms-4 mb-3">
                                <Form.Text className="text-muted">
                                    First time here? <Link to={"/users/register"}> Register </Link>
                                </Form.Text>
                            </Form.Group>
                            
                            {/* <input type="hidden" name="_csrf" value={csrfToken} /> */}
                            <Button variant="secondary" className="ms-4" type="submit">
                                Submit
                            </Button>
                            <Form.Text className="text-muted mt-3 ms-4">
                                {errorNotification}
                            </Form.Text>
                        </Form>
                    </Col>
                    <Col>
                        <img    src="/login-page-welcome.jpg" 
                                style={{maxHeight: '100%', maxWidth:'100%', objectFit:'fill'}}
                                className="d-none d-md-block"
                                alt="welcome"
                        />
                    </Col>
                </Row>
            </Container>
        </>
        );
}
    