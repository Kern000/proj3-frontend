import React, {useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../context/user-context';

import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { useNavigate, useParams } from 'react-router-dom';

import { CloudinaryContext } from '../context/cloudinary-context';
import { DashBoardContext } from '../context/dashboard-context';

import UploadWidget from './uploadWidget';

import APIHandler from '../api/apiHandler';

export default function UpdateProductForm(){

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [chapterContent, setChapterContent] = useState('');
    const [postCategoryId, setPostCategoryId] = useState('');
    const [genreId, setGenreId] = useState('');

    const {userId, setUserId} = useContext(UserContext);
    const {imageUrl, setImageUrl, thumbnailUrl, setThumbnailUrl, imageUploaded, setImageUploaded} = useContext(CloudinaryContext);
    const {reRender, setReRender} = useContext(DashBoardContext);

    const [singleProductData, setSingleProductData] = useState();

    const [errorNotification, setErrorNotification] = useState('');
    const [successNotification, setSuccessNotification] = useState('');

    const userIdRef = useRef(userId);

    const {productId} = useParams();

    const [retrievedProductId, setRetrievedProductId] = useState();

    const navigate = useNavigate();

    function handleGoBack(){
        navigate(-1);
    }

    const retrieveProductById = async (productId) => {
        try{
            console.log('frontend retrieve product by id hit, userId here=>', userId)
            console.log('frontend product params', productId);

            let response = await APIHandler.get(`/users/update/${productId}?userId=${userId || userIdRef.current}`);
            console.log('retrieving single product', response.data.product);

            setSingleProductData(response.data.product);
            setName(response.data.product.name);
            setPrice(response.data.product.price);
            setDescription(response.data.product.description);
            setStock(response.data.product.stock);
            setChapterContent(response.data.product.chapter_content);
            setPostCategoryId(response.data.product.post_category_id);
            setGenreId(response.data.product.genres.map(genre => genre._pivot_genre_id));
            setImageUrl(response.data.product.image_url);
            setThumbnailUrl(response.data.product.thumbnail_url);
            setRetrievedProductId(response.data.product.id);

            setImageUploaded(false);

            console.log('success in loading data')
    
        } catch (error) {
            console.error('error retrieving product data', error)
        }
    }

    useEffect(()=>{
        if (localStorage.getItem('userId')){
            setUserId(localStorage.getItem('userId'))
        }
        retrieveProductById(productId)
        .catch((error)=>{console.log('fail to set data', error)})

    },[])

    const handleGenreChange = (event) => {
        const { value, checked } = event.target;
        
        if (checked) {
            if (genreId.length > 0){
                setGenreId([...genreId, parseInt(value)])
            } else {
                setGenreId([parseInt(value)])
            }
        } else {

            let genreArray = genreId.filter((genreId) => genreId !== parseInt(value))
            setGenreId(genreArray);
        }
    }

    const handleSubmit = async (event) => {

        event.preventDefault();

        const generalRegexPattern = /^[a-zA-Z0-9.,_ %+\-!:?;"'@#$&()]*$/i;
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
                "productId": retrievedProductId,
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
                await APIHandler.post(`/users/${productId}/update?userId=${userIdRef.current}`, payload);
                
                console.log('product updated')
                setSuccessNotification("Product Updated");
                setTimeout(()=>{
                    setReRender(!reRender);
                    handleGoBack()
                }, 1000);
                
            } catch (error) {
                setErrorNotification('Fail to update product');
            }
        }
    }

    return(
        <>
            <Button variant="secondary" className="ms-4 mt-2 mb-3" onClick={handleGoBack}> Back </Button>

            {singleProductData ?
                (<Container className="mb-2 mt-3">
                <h5> Update work </h5>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" style={{maxWidth: '350px', minWidth:'350px', maxHeight:'60px'}}>
                        <Form.Label style={{fontSize:"12px"}}>Title Name</Form.Label>
                        <Form.Control   type="text" 
                                        style={{fontSize:"12px"}}
                                        name="name"
                                        value={name? name : singleProductData.name}
                                        onChange={(event)=> setName(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{maxWidth: '350px', minWidth:'350px', maxHeight:'60px'}}>
                        <Form.Label style={{fontSize:"12px"}}>Price</Form.Label>
                        <Form.Control   type="text"
                                        style={{fontSize:"12px"}}
                                        name="price"
                                        value={price? price : singleProductData.price}
                                        onChange={(event)=>setPrice(event.target.value)}
                        />
                    </Form.Group>                    
                    <Form.Group className="mb-3" style={{maxWidth: '350px', minWidth:'300px', maxHeight:'60px'}}>
                        <Form.Label style={{fontSize:"12px"}}>Description</Form.Label>
                        <Form.Control   type="text"
                                        name="description"
                                        style={{fontSize:"12px"}}
                                        value={description? description : singleProductData.description}
                                        onChange={(event) => setDescription(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{maxWidth: '350px', minWidth:'300px', maxHeight:'60px'}}>
                        <Form.Label style={{fontSize:"12px"}}>Stock</Form.Label>
                        <Form.Control   type="text"
                                        name="stock"
                                        style={{fontSize:"12px"}}
                                        value={stock? stock : singleProductData.stock}
                                        onChange={(event) => setStock(event.target.value)}
                        />
                    </Form.Group>                        
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{fontSize:"12px"}}>Chapter Content</Form.Label>
                        <Form.Control   as="textarea" 
                                        rows={15}
                                        style={{fontSize:'14px'}}
                                        name="chapterContent"
                                        value={chapterContent? chapterContent : singleProductData.chapter_content}
                                        onChange={(event) => setChapterContent(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{fontSize:"12px"}}>Work Category</Form.Label>
                        <Form.Select    aria-label="Work Category"
                                        name="postCategoryId"
                                        value={postCategoryId? postCategoryId : singleProductData.post_category_id}
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
                                checked={genreId? (genreId.includes(1)) : (singleProductData.genres.map(genre => genre._pivot_genre_id === 1))}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="drama"
                                style={{fontSize:"14px"}}
                                name="drama"
                                value="2"
                                checked={genreId? (genreId.includes(2)) : (singleProductData.genres.map(genre => genre._pivot_genre_id === 2))}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="romance"
                                style={{fontSize:"14px"}}
                                name="romance"
                                value="3"
                                checked={genreId? (genreId.includes(3)) : (singleProductData.genres.map(genre => genre._pivot_genre_id === 3))}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="comedy"
                                style={{fontSize:"14px"}}
                                name="comedy"
                                value="4"
                                checked={genreId? (genreId.includes(4)) : (singleProductData.genres.map(genre => genre._pivot_genre_id === 4))}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="animal"
                                style={{fontSize:"14px"}}
                                name="animal"
                                value="5"
                                checked={genreId? genreId.includes(5) : (singleProductData.genres.map(genre => genre._pivot_genre_id === 5))}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="selfhelp"
                                style={{fontSize:"14px"}}
                                name="selfhelp"
                                value="6"
                                checked={genreId? genreId.includes(6) : (singleProductData.genres.map(genre => genre._pivot_genre_id === 6))}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="business"
                                style={{fontSize:"14px"}}
                                name="business"
                                value="7"
                                checked={genreId? genreId.includes(7) : (singleProductData.genres.map(genre => genre._pivot_genre_id === 7))}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="biography"
                                style={{fontSize:"14px"}}
                                name="biography"
                                value="8"
                                checked={genreId? genreId.includes(8) : (singleProductData.genres.map(genre => genre._pivot_genre_id === 8))}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="art"
                                style={{fontSize:"14px"}}
                                name="art"
                                value="9"
                                checked={genreId? genreId.includes(9) : (singleProductData.genres.map(genre => genre._pivot_genre_id === 9))}
                                onChange={handleGenreChange}
                        />
                        <Form.Check
                                type="checkbox"
                                label="coding"
                                style={{fontSize:"14px"}}
                                name="coding"
                                value="10"
                                checked={genreId? genreId.includes(10) : (singleProductData.genres.map(genre => genre._pivot_genre_id === 10))}
                                onChange={handleGenreChange}
                        />
                    </Form.Group>
                </Form>
                    {imageUploaded && imageUrl? ( null ):
                               (   <div className="mt-4">
                                        <h6> Existing Picture </h6>
                                        <img src={singleProductData.image_url} alt="placeholder_image" className="oldpic" style={{maxWidth:'500px'}}/>
                                    </div>    
                                )}
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
            </Container>) : (<div className='ms-4'> Loading ... </div>)
            }
        </>
    )
}

