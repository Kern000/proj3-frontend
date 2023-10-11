import React, {useState, useContext, useRef, useEffect} from 'react';

import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { CloudinaryContext } from '../context/cloudinary-context';
import { DashBoardContext } from '../context/dashboard-context';
import { UserContext } from '../context/user-context';

import UploadWidget from './uploadWidget';

import APIHandler from '../api/apiHandler';
import { Navigate, useNavigate } from 'react-router-dom';

export default function AddProductForm(){

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const [stock, setStock] = useState('');
    const [chapterContent, setChapterContent] = useState('');
    const [postCategoryId, setPostCategoryId] = useState('');
    const [genreId, setGenreId] = useState([]);

    const {userId, setUserId} = useContext(UserContext);
    const {imageUrl, thumbnailUrl} = useContext(CloudinaryContext);

    const [errorNotification, setErrorNotification] = useState('');
    const [successNotification, setSuccessNotification] = useState('');

    const {reRender, setReRender} = useContext(DashBoardContext);
    const {setShowItem} = useContext(DashBoardContext);
    const {setShowProducts} = useContext(DashBoardContext);

    const userIdRef = useRef(userId);

    useEffect(()=>{
        if (localStorage.getItem('userId')){
            setUserId(localStorage.getItem('userId'))
        }
    },[])

    
    const handleGenreChange = (event) => {
        const { value, checked } = event.target;
        
        if (checked) {
            if (genreId.length > 0){
                setGenreId([...genreId, value])
            } else {
                setGenreId([value])
            }
        } else {

            let genreArray = genreId.filter((genreId) => genreId !== value)
            setGenreId(genreArray);
        }
    }

    const navigate = useNavigate();
    
    const navigateToDashBoard = () => {
        navigate(`/users/dashboard/${userId}`)
    }

    const handleSubmit = async (event) => {

        event.preventDefault();

        const generalRegexPattern = /^[a-zA-Z0-9.,_ %+\-!:?;"'@#$&()\/\s]*$/i;
        const numberRegexPattern = /^[0-9]{0,}$/;

        if (    name ==='' || 
                price ==='' || 
                description ==='' || 
                stock ==='' ||
                chapterContent === '' ||
                postCategoryId === '' ||
                genreId === ''
                ){
            
                setErrorNotification('Fields cannot be empty');
        }
        else if (name && !generalRegexPattern.test(name)){
            setErrorNotification('Invalid title name characters');
        }
        else if (price && !numberRegexPattern.test(price)){
            setErrorNotification('Invalid price characters');
        }
        else if (description && !generalRegexPattern.test(description)){
            setErrorNotification('Invalid description characters');
        }
        else if (stock && !numberRegexPattern.test(stock)){
            setErrorNotification('Invalid stock characters');     
        }
        else if (chapterContent && !generalRegexPattern.test(chapterContent)){
            setErrorNotification('Invalid chapter content characters');
        }
        else {
            
            setErrorNotification('');
            setSuccessNotification('');

            const payload = {
                "name": name,
                "price": price,
                "description": description,
                "imageUrl": imageUrl,
                "thumbnailUrl": thumbnailUrl,
                "stock": stock,
                "postCategoryId": postCategoryId,
                "chapterContent": chapterContent,
                "genreId": genreId,
                "userId": userId
            }

            try {
                console.log("frontend userIdref here", userIdRef.current)
                console.log("frontend payload here", payload);
                await APIHandler.post(`/users/add-product/${userIdRef.current}`, payload);

                setSuccessNotification('Success! Product added');
                setTimeout(()=>{
                    setShowItem('');
                    setShowProducts(true);
                    setReRender(!reRender);
                    navigateToDashBoard(userId)
                },1000);

            } catch (error) {
                setErrorNotification('Failed to add product');
            }
        }
    }

    return(
        <>
            <Container className="mb-2 mt-3">
                <h5> List a work </h5>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" style={{maxWidth: '350px', minWidth:'350px', maxHeight:'60px'}}>
                        <Form.Label style={{fontSize:"12px"}}>Title Name</Form.Label>
                        <Form.Control   type="text" 
                                        style={{fontSize:"12px"}}
                                        placeholder="Enter title name"
                                        name="name"
                                        value={name}
                                        onChange={(event)=> setName(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{maxWidth: '350px', minWidth:'350px', maxHeight:'60px'}}>
                        <Form.Label style={{fontSize:"12px"}}>Price</Form.Label>
                        <Form.Control   type="text"
                                        placeholder="Enter 0 if free"
                                        style={{fontSize:"12px"}}
                                        name="price"
                                        value={price}
                                        onChange={(event)=>setPrice(event.target.value)}
                        />
                    </Form.Group>                    
                    <Form.Group className="mb-3" style={{maxWidth: '350px', minWidth:'300px', maxHeight:'60px'}}>
                        <Form.Label style={{fontSize:"12px"}}>Description</Form.Label>
                        <Form.Control   type="text"
                                        name="description"
                                        style={{fontSize:"12px"}}
                                        placeholder="description" 
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{maxWidth: '350px', minWidth:'300px', maxHeight:'60px'}}>
                        <Form.Label style={{fontSize:"12px"}}>Stock</Form.Label>
                        <Form.Control   type="text"
                                        name="stock"
                                        style={{fontSize:"12px"}}
                                        placeholder="Enter 0 if n/a" 
                                        value={stock}
                                        onChange={(event) => setStock(event.target.value)}
                        />
                    </Form.Group>                        
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{fontSize:"12px"}}>Chapter Content</Form.Label>
                        <Form.Control   as="textarea" 
                                        rows={15}
                                        style={{fontSize:'14px'}}
                                        placeholder="Place chapter content here"
                                        name="chapterContent"
                                        value={chapterContent}
                                        onChange={(event) => setChapterContent(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{fontSize:"12px"}}>Work Category</Form.Label>
                        <Form.Select    aria-label="Work Category"
                                        name="postCategoryId"
                                        value={postCategoryId}
                                        onChange={(event)=>setPostCategoryId(event.target.value)}
                                        style={{maxWidth: '350px', minWidth:'350px', maxHeight:'60px', fontSize: '14px'}}
                        >
                            <option>Select Category of Work</option>
                            <option value="1">Free</option>
                            <option value="2">Webnovel</option>
                            <option value="3">Published</option>
                            <option value="4">Manuscript</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{fontSize:"12px"}}>Genres</Form.Label>
                        <Form.Check
                                type="checkbox"
                                label="fantasy"
                                style={{fontSize:"14px"}}
                                name="fantasy"
                                value="1"
                                checked={genreId.includes("1")}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="drama"
                                style={{fontSize:"14px"}}
                                name="drama"
                                value="2"
                                checked={genreId.includes("2")}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="romance"
                                style={{fontSize:"14px"}}
                                name="romance"
                                value="3"
                                checked={genreId.includes("3")}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="comedy"
                                style={{fontSize:"14px"}}
                                name="comedy"
                                value="4"
                                checked={genreId.includes("4")}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="animal"
                                style={{fontSize:"14px"}}
                                name="animal"
                                value="5"
                                checked={genreId.includes("5")}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="selfhelp"
                                style={{fontSize:"14px"}}
                                name="selfhelp"
                                value="6"
                                checked={genreId.includes("6")}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="business"
                                style={{fontSize:"14px"}}
                                name="business"
                                value="7"
                                checked={genreId.includes("7")}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="biography"
                                style={{fontSize:"14px"}}
                                name="biography"
                                value="8"
                                checked={genreId.includes("8")}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="art"
                                style={{fontSize:"14px"}}
                                name="art"
                                value="9"
                                checked={genreId.includes("9")}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="coding"
                                style={{fontSize:"14px"}}
                                name="coding"
                                value="10"
                                checked={genreId.includes("10")}
                                onChange={handleGenreChange}
                        />
                    </Form.Group>

                </Form>
                <UploadWidget />
                <Form.Text className="mt-2 ms-2 mb-2" style={{color:'red'}}>
                    {errorNotification}
                </Form.Text>
                <Form.Text className="mt-2 ms-2 mb-2" style={{color:'green'}}>
                    {successNotification}
                </Form.Text>
                <div>
                    <Button variant="secondary" className="mb-5 mt-3" onClick={handleSubmit}>
                            Submit
                    </Button>
                </div>
            </Container>
        </>
    )
}

