// lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: "https://khlasify-widget-be.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

// Tambahkan interceptor ini agar setiap request membawa token terbaru
api.interceptors.request.use((config) => {
    // Ambil token dari cookie 'login_token'
    const token = Cookies.get("login_token");
    
    if (token) {
        // Tempelkan ke header Authorization seperti standar Postman
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});