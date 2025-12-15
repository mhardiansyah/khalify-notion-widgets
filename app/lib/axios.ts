import axios from "axios";

export const api = axios.create({
    baseURL: "https://khalify-be.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    
})