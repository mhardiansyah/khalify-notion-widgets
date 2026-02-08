// lib/payment.api.ts
import { api } from "./axios";

export const getPaymentLink = async () => {
  // Gunakan instance 'api' agar interceptor jalan
  const res = await api.post("/payment/link", {}); 
  return res.data;
};

export const checkPaymentStatus = async () => {
  // Gunakan instance 'api'
  const res = await api.get("/payment/check-status");
  return res.data;
};