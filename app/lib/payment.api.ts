// lib/payment.api.ts
import { headers } from "next/headers";
import { api } from "./axios";

export const getPaymentLink = async () => {
  const res = await api.post("/payment/link", {
    headers: {
      Authorization: `Bearer ${(await headers()).get("login_token")}`,
    },
  });
  return res.data;
};

export const checkPaymentStatus = async () => {
  const res = await api.get("/payment/check-status", {
    headers: {
      Authorization: `Bearer ${(await headers()).get("login_token")}`,
    },
  });
  return res.data;
};