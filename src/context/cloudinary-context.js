import React, {useState, createContext} from 'react';

export const CloudinaryContext = createContext();

const CloudinaryContextData = ({children}) => {

    const [imageUrl, setImageUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [imageUploaded, setImageUploaded] = useState(false);

    return (
        <CloudinaryContext.Provider value={{imageUrl, setImageUrl, thumbnailUrl, setThumbnailUrl, imageUploaded, setImageUploaded}}>
            {children}
        </CloudinaryContext.Provider>
    )
}

export default CloudinaryContextData;