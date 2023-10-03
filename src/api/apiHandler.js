import axios from 'axios';

export let baseURL = "https://3000-kern000-projectthreebac-em7lw5jkwpd.ws-us105.gitpod.io"

const APIHandler = axios.create({
    "baseURL": baseURL
})

export let headersData = {}

export const setAuthHeader = async (accessToken, refreshToken) => {

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        headersData["Authorization"] = `Bearer ${accessToken}`
        console.log('set item with setAuth header', headersData["Authorization"])
    APIHandler.defaults.headers.common["Authorization"] = headersData["Authorization"]
}

export const clearAuthHeader = () => {
    delete APIHandler.defaults.headers.common["Authorization"];
    localStorage.clear();
}

export default APIHandler;
