import { createContext, useState, useEffect } from "react";

export const UserContext= createContext();

const UserContextData = ({children}) => {

    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [accessToken, setAccessToken] = useState(''); 

    useEffect(()=> {
        const retrieveData = async() => {
            try{
                let defaultUserName = localStorage.getItem("userName")? localStorage.getItem("userName") : '';
                let defaultUserId = localStorage.getItem("userId")? localStorage.getItem("userId") : '';
                let accessToken = localStorage.getItem("accessToken")? localStorage.getItem("accessToken") : '';
                setUserName(defaultUserName);
                setUserId(defaultUserId);
                setAccessToken(accessToken);
            } catch (error) {
                console.error('Error in username and id retrieval and token', error)
            }
        }
        retrieveData();
    }, [])

    return(
        <UserContext.Provider value={{userName, setUserName, userId, setUserId, accessToken, setAccessToken}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextData;