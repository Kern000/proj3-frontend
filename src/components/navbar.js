import React from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function NavBar(){
    return (
        <nav>
            {['sm'].map((expand) => (
            <Navbar bg="dark" data-bs-theme="dark" key={expand} expand={expand} className="bg-body-tertiary mb-3">
                <Container fluid>
                <Navbar.Brand href="/">The Writers' Base</Navbar.Brand>
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
                        <Nav.Link href="/user/login" className="mt-2">Dashboard</Nav.Link>
                        <Nav.Link href="#action2" className="mt-2">Start Listing</Nav.Link>
                        <NavDropdown
                        title="Saved Works"
                        id={`offcanvasNavbarDropdown-expand-${expand}`}
                        className="mt-2 me-4"
                        >
                        <NavDropdown.Item href="#action3">Favorites</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action4">View Cart</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2 mt-2"
                        aria-label="Search"
                        style={{maxHeight:'40px'}}
                        />
                        <Button 
                        className="mt-2"
                        variant="outline-primary"
                        style={{maxHeight:'40px'}}                      
                        >Search</Button>
                    </Form>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
                </Container>
            </Navbar>
            ))}
        </nav>
    )
}