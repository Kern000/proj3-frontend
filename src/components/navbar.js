import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import APIHandler, { headersData } from '../api/apiHandler';

import { UserContext } from '../context/user-context'
import { SearchContext } from '../context/search-context';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function NavBar(){

    const {userId, setUserId} = useContext(UserContext);
    const {setSearchData} = useContext(SearchContext);

    const [name, setName] = useState();
    const [errorNotification, setErrorNotification] = useState();
    
    let navigate = useNavigate();

    const handleLoginState = async () => {

        if (localStorage.getItem('accessToken')){

            console.log('get token')

            try {

                let accessToken = localStorage.getItem('accessToken');
                headersData["Authorization"] = `Bearer ${accessToken}`
                APIHandler.defaults.headers.common["Authorization"] = headersData["Authorization"]

                await APIHandler.get('/users/check-login');
                console.log('jwt still in play')

                if (localStorage.getItem('userId')){
                    setUserId(localStorage.getItem('userId'))
                }
    
                navigate(`/users/dashboard/${userId}`);

            } catch (error){
                console.log('login again')
                navigate('/users/login');
            }
        } else {
            navigate('/users/login');
        }
    }

    const navigateToSearchResult = () => {
        navigate('/search-results')
    }

    const handleHome = () => {
        navigate('/');
    }

    const handleSearchInput = (event) => {
        setErrorNotification('');
        setName(event.target.value);
    }

    const handleSubmit = async (event) => {

        event.preventDefault();

        const generalRegexPattern = /^[a-zA-Z0-9._ %+\-!@#$&*()]*$/i;

        if (name && !generalRegexPattern.test(name)){
            setErrorNotification('Invalid title characters')
        } else {

            const payload = {
                "name": name
            }
            console.log("frontend req.body here=>", payload)
            
            try {
                let response = await APIHandler.post('/search', payload)
                console.log('fetched data from search engine =>', response.data.products)
                await setSearchData(response.data.products)
                
                navigateToSearchResult()

            } catch(error) {
                console.log('error fetching products', error)
            }

        }
    }

    return (
        <>
        <nav>
            {['sm'].map((expand) => (
            <Navbar bg="dark" data-bs-theme="dark" key={expand} expand={expand} className="bg-body-tertiary mb-3">
                <Container fluid>
                <Navbar.Brand onClick={handleHome}>The Writers' Base <br />
                    <span style={{fontSize:'12px', color:'#FFFDD0'}}> Where writers, manuscripts, and ideas gather </span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />

                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="end"
                >
                    <Offcanvas.Header closeButton>
                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                        Writers' Base Navigation
                    </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-2 mb-3">
                        <Nav.Link onClick={handleLoginState} className="mt-2">Dashboard</Nav.Link>
                        <Nav.Link onClick={handleLoginState} className="mt-2">Start Listing</Nav.Link>
                        <NavDropdown
                        title="Saved Works"
                        id={`offcanvasNavbarDropdown-expand-${expand}`}
                        className="mt-2 me-4"
                        >
                        <NavDropdown.Item onClick={handleLoginState}>Favorites (coming soon)</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLoginState}>Saved User (coming soon)</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form onSubmit={handleSubmit} className="d-flex">
                        <Form.Control
                        type="search"
                        placeholder="Search title name"
                        className="me-2 mt-2"
                        aria-label="Search"
                        value={name}
                        onChange={handleSearchInput}
                        style={{maxHeight:'40px'}}
                        />
                        <Button 
                        className="mt-2"
                        variant="outline-primary"
                        style={{maxHeight:'40px'}}
                        type="submit"                
                        >Search</Button>
                    </Form>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
                </Container>
            </Navbar>
            ))}
        </nav>
        {errorNotification? 
            (<div className="ms-3 mb-3" style={{color:'red'}}>
                {errorNotification}
            </div>): null}
        </>
    )
}