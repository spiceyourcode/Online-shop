import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8081/api"
});

//adding the token automatically 
api.interceptors.request.use((config)=> {
    // check the access token from the browser localstorage
    const token = localStorage.getItem("access");
    // if it exists add the authorization header with token to the request
    if(token){
        config.headers.Authorization =`Bearer ${token}`
    }
    return config;
});

export default api;
