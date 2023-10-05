import React, {useEffect, useContext} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import APIHandler from '../api/apiHandler';

import { useNavigate } from 'react-router-dom';

import { DeletionContext } from '../context/delete-context';
import { UserContext } from '../context/user-context';

export default function DeleteConfirmation () {

    const {idOfProductForDeletion, setIdOfProductForDeletion} = useContext(DeletionContext);
    const {userId, setUserId} = useContext(UserContext);
    
    useEffect(()=>{
        if (localStorage.getItem('userId')){
            setUserId(localStorage.getItem('userId'));
        }
    }, [])

    const navigate = useNavigate();

    const navigateToDashBoard = () => {
        navigate(`/users/dashboard/${userId}`)
    }

    const handleNoButton = () => {
        setIdOfProductForDeletion('')
    }

    const handleDeleteConfirmationButton = () => {
        try {
            APIHandler.post(`/users/${idOfProductForDeletion}/delete?userId=${userId}`);
            setIdOfProductForDeletion('')
            console.log('product deleted');
            navigateToDashBoard(userId);

        } catch (error) {
            console.log('failed to delete product', error)
        }
    }

    return(
        <> 
            {idOfProductForDeletion?
            ( 
                <Container className="pt-0 ms-2 mt-0" style={{maxWidth: '350px', marginBottom:'150px', justifySelf:'left'}}>
                    <Card>
                        <Card.Title className="pt-3" style={{fontSize:'16px', textAlign:'center'}}> Do you really want to delete this? </Card.Title>
                        <Card.Body className="d-flex justify-content-center">
                            <Button variant="success" className="btn-sm" onClick={()=>handleNoButton()}> No </Button>
                            <Button variant="danger" className="ms-4 btn-sm" onClick={()=>handleDeleteConfirmationButton(idOfProductForDeletion)}> Yes </Button>
                        </Card.Body>
                    </Card>
                </Container>
            ) : null
            }
        </>
    )
}