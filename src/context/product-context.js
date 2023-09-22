import React, {useState, createContext, useMemo} from 'react';

export const ProductContext = createContext();

const ProductContextData = ({children}) => {

    const [name, setName] = useState('')
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [dateCreated, setDateCreated] = useState('');
    const [stock, setStock] = useState('');
    const [chapterContent, setChapterContent] = useState('');
    const [postCategory, setPostCategory] = useState('');
    const [genres, setGenres] = useState('');
    const [sellerUserId, setSellerUserId] = useState('');

    const contextValue = useMemo(()=>{
        return({
            name, setName,
            price, setPrice,
            description, setDescription,
            imageUrl, setImageUrl,
            thumbnailUrl, setThumbnailUrl,
            dateCreated, setDateCreated,
            stock, setStock,
            chapterContent, setChapterContent,
            postCategory, setPostCategory,
            genres, setGenres,
            sellerUserId, setSellerUserId            
        })
    },  [
            name, setName,
            price, setPrice,
            description, setDescription,
            imageUrl, setImageUrl,
            thumbnailUrl, setThumbnailUrl,
            dateCreated, setDateCreated,
            stock, setStock,
            chapterContent, setChapterContent,
            postCategory, setPostCategory,
            genres, setGenres,
            sellerUserId, setSellerUserId            
        ]
    )

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>        
    )
}

export default ProductContextData;