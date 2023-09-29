import axios from 'axios';

const APIHandler = axios.create({
    "baseURL": "https://3000-kern000-projectthreebac-em7lw5jkwpd.ws-us105.gitpod.io"
})

export let headersData = {}

// export const setCSRF = async (csrfToken) => {

//     localStorage.setItem("csrfToken", csrfToken)
//     headersData["X-XSRF-TOKEN"] = csrfToken
//     APIHandler.defaults.headers['Content-Type'] = 'application/json';
//     APIHandler.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken
// }

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
