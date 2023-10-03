import React, { useState, useContext, useRef, useEffect } from 'react';
import { CloudinaryContext } from '../context/cloudinary-context';
import env from "react-dotenv";

export default function UploadWidget(){

    const {setImageUrl, setThumbnailUrl} = useContext(CloudinaryContext);
    const [notification, setNotification] = useState('')
    
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() =>{
        cloudinaryRef.current = window.cloudinary;
        console.log('cloudname here', env.CLOUDINARY_NAME);
        console.log('cloudpreset here', env.CLOUDINARY_UPLOAD_PRESET);
        setNotification('');

        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: env.CLOUDINARY_NAME,
            uploadPreset: env.CLOUDINARY_UPLOAD_PRESET,       
        }, function(error, result){
           console.log(result)
           if (!error && result.event == 'success'){
                
                console.log('cloudinary is working');
                const cloudinaryImageUrl = result.info.url;
                const cloudinaryThumbnailUrl = result.info.thumbnail_url;
                console.log("cloudinaryImageUrl=>", cloudinaryImageUrl);
                console.log("cloudinaryThumbnailUrl=>", cloudinaryThumbnailUrl);

                setImageUrl(cloudinaryImageUrl);
                setThumbnailUrl(cloudinaryThumbnailUrl);

                document.querySelector("#uploaded_image").src = cloudinaryImageUrl;
                document.querySelector("#uploaded_image").style.display = "block";
                
                console.log('cloudinary data retrieved')
                setNotification("Upload Success!")
            }
        })        
    }, [])

    const handleWidgetClick = (event) => {
        event.preventDefault();

        widgetRef.current.open()
    }

    return( 
        <>
            <div>
                <button onClick={handleWidgetClick} className="mt-3 mb-1 btn btn-primary btn-sm"> Upload New Image </button>
            </div>
            <img src="" className="mt-2" style={{display:'none', maxWidth:'600px', objectFit:'contain'}} id="uploaded_image" alt="uploadedImage"/>
            <div style={{color:'green'}}>
                {notification}
            </div>
        </>
    )
}

