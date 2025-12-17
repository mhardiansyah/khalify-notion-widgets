import { api } from "./axios"
import { CreateWidgetDto } from "./dto/create-widget.dto";

export const getNotionDatabases = async (token: string) => {
    const res = await api.post("/widgets/getNotionDatabases", { token,});

    return res.data;
}

export const createWidget = async (payload: CreateWidgetDto) => {
    const res = await api.post("/widgets/create", payload);

    return res.data;
}