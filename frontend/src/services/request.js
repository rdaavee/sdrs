import axios from "axios";

const ROUTE = `${import.meta.env.VITE_API_URL}/request`;
export const getRequestReceipt = async () => {
    try {
        const response = await axios.get(`${ROUTE}/get-request-receipt`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = response.data;
        return data.message;
    } catch (error) {
        const axiosError = error;
        const errMsg = axiosError.response?.data?.error || "Unknown error";
        return errMsg;
    }
};
export const saveRequestReceipt = async (dataForm) => {
    try {
        const response = await axios.post(
            `${ROUTE}/save-request-receipt`,
            dataForm,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response;
    } catch (error) {
        const axiosError = error;
        const errMsg = axiosError.response?.data?.error || "Unknown error";
        return errMsg;
    }
};
