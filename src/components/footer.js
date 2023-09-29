import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Nav from "react-bootstrap/Nav";

export default function Footer() {

  return (
    <>
        <footer>
            <Navbar bg="dark" variant="dark" fixed="bottom" style={{height:'30px'}}>
                <Container fluid>
                    <Navbar.Brand style={{fontSize:'14px'}}> &copy; 2023 The Writers' Base </Navbar.Brand>
                    <Nav>
                        <Nav.Link className="ml-auto d-none d-sm-flex" style={{color:'white', fontSize:'14px'}}>Team</Nav.Link>
                        <Nav.Link className="ml-auto d-none d-sm-flex" style={{color:'white', fontSize:'14px'}}>Careers</Nav.Link>
                        <Nav.Link className="ml-auto d-none d-sm-flex" style={{color:'white', fontSize:'14px'}}>Blog</Nav.Link>
                        <Nav.Link className="ml-auto d-none d-sm-flex" style={{color:'white', fontSize:'14px'}}>Connect</Nav.Link>
                        <Nav.Link > <img src="/fb.jpg" style={{objectFit:'scaledown', height:'20px', marginBottom:'2px'}}/></Nav.Link>
                        <Nav.Link > <img src="/insta.jpg" style={{objectFit:'fill', height:'20px', maxWidth:'20px', marginBottom:'2px'}}/></Nav.Link>
                        <Nav.Link > <img src="/twitterx.png" style={{objectFit:'fill', height:'20px', maxWidth:'20px', marginBottom:'2px'}}/></Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </footer>
    </>
  );
}

