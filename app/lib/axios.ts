// lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:4545";

export const api = axios.create({
    baseURL: API_URL, 
    headers: {
        "Content-Type": "application/json",
    },
});

// INTERCEPTOR (Tukang Tempel Token)
api.interceptors.request.use((config) => {
    const rawToken = Cookies.get("login_token");
    
    if (rawToken) {
        // 1. Bersihin token dari spasi/enter yang gak sengaja ke-copy
        const cleanToken = rawToken.trim().replace(/[\n\r]/g, "");
        
        // 2. Tempel string "Bearer" + spasi + token (SATU BARIS)
        config.headers.Authorization = `Bearer ${cleanToken}`;
        
        // Cek console browser lo nanti, harusnya LURUS satu baris
        console.log("🛠️ Header OTW:", config.headers.Authorization);
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});