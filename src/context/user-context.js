import { createContext, useState, useEffect } from "react";

export const UserContext= createContext();

const UserContextData = ({children}) => {

    const [userName, setUserName] = useState('');
    const [paramsId, setParamsId] = useState('');

    useEffect(()=> {
        const retrieveData = async() => {
            try{
                let defaultUserName = localStorage.getItem("userName")? localStorage.getItem("userName") : '';
                setUserName(defaultUserName);
            } catch (error) {
                console.error('Error in email retrieval', error)
            }
        }
        retrieveData();
    }, [])

    return(
        <UserContext.Provider value={{userName, setUserName, paramsId, setParamsId}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextData;