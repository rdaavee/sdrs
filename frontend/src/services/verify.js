import axios from "axios";

const ROUTE = `/api/verify`;
export const requestCode = async (email_address) => {
    try {
        const response = await axios.get(`${ROUTE}/request-code`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
            params: { email_address },
        });
        const data = response.data;
        return data.message;
    } catch (error) {
        const axiosError = error;
        const errMsg = axiosError.response?.data?.error || "Unknown error";
        return errMsg;
    }
};
export const verifyCode = async (code) => {
    try {
        const response = await axios.post(
            `${ROUTE}/verify-code`,
            { code },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = response.data;
        return data.message === "Success";
    } catch (error) {
        console.log(error);
        return false;
    }
};
