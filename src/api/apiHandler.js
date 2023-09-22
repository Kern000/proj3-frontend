import axios from 'axios';

const APIHandler = axios.create({
    "baseURL": "https://3000-kern000-projectthreebac-em7lw5jkwpd.ws-us104.gitpod.io"
})

export let headersData = {}

export const setAuthHeader = async (token) => {

    if (localStorage.getItem("token")){
        let accessToken = localStorage.getItem("token");
        headersData["Authorization"] = `Bearer ${accessToken}`
    } else {
        localStorage.setItem("token", token);
        headersData["Authorization"] = `Bearer ${token}`
    }
    APIHandler.defaults.headers.common["Authorization"] = headersData["Authorization"]
}

export const clearAuthHeader = () => {
    delete APIHandler.defaults.headers.common["Authorization"];
    localStorage.clear();
}



export default APIHandler;
