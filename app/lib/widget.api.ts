// lib/widget.api.ts
import { api } from "./axios";
// import { CreateWidgetDto } from "./dto/create-widget.dto"; // Nyalain kalo filenya ada

export const getNotionDatabases = async (token: string) => {
  const res = await api.post(`/widgets/getNotionDatabases/${token}`);
  return res.data;
};

export const createWidget = async (payload: any) => {
    const res = await api.post("/widgets/create", payload);
    return res.data;
}

export const getWidgetByDbID = async (dbID: string) => {
  const res = await api.get(`/widgets/${dbID}`);
  return res.data;
};

export const getWidgetsByUser = async (jwt: string) => {
  const res = await api.get("/widgets/list", {
    headers: {
      "khalify-token": jwt, // Header khusus lo
    }
  });
  return res.data;
}

export const deleteWidget = async(id: string) => {
  const res = await api.delete(`/widgets/delete/${id}`);
  return res.data;
}