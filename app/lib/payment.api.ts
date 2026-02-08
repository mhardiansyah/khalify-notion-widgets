// lib/payment.api.ts
import { api } from "./axios";
import Cookies from "js-cookie";

export const getPaymentLink = async () => {
  const token = Cookies.get("login_token");

  const res = await api.post(
    "/payment/link",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const checkPaymentStatus = async () => {
  const token = Cookies.get("login_token");

  const res = await api.get("/payment/check-status", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
