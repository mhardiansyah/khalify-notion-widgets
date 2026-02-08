// lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: "https://khlasify-widget-be.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("login_token");
    
    if (token) {
        // PAKAI TEMPLATE LITERAL DAN TRIM BIAR BERSIH CUK
        config.headers.Authorization = `Bearer ${token.trim()}`;
        console.log("Header Set:", config.headers.Authorization);
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});