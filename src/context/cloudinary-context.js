import React, {useState, createContext} from 'react';

export const CloudinaryContext = createContext();

const CloudinaryContextData = ({children}) => {

    const [imageUrl, setImageUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    return (
        <CloudinaryContext.Provider value={{imageUrl, setImageUrl, thumbnailUrl, setThumbnailUrl}}>
            {children}
        </CloudinaryContext.Provider>
    )
}

export default CloudinaryContextData;