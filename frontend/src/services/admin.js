import axios from "axios";
import Cookies from "universal-cookie";

export const cookies = new Cookies();

const ROUTE = `${import.meta.env.VITE_API_URL}/admin`;

export const login = async (dataForm) => {
    const response = await axios.post(`${ROUTE}/login`, dataForm, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log(response);
    const data = response.data;
    return data;
};
export const createAdminAccount = async (dataForm) => {
    try {
        const response = await axios.post(`${ROUTE}/signup`, dataForm, {
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

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${ROUTE}/users`, {
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
export const authenticateToken = async () => {
    const response = await axios
        .post(
            `${ROUTE}/checkCurrentUser`,
            {},
            {
                withCredentials: true,
                headers: {
                    authorization: cookies.get("authorization"),
                },
            }
        )
        .then((response) => response.data)
        .catch((error) => {
            return error.message;
        });
    return response.message === "valid";
};
export const logout = () => {
    cookies.remove("authorization");
    cookies.remove("userFullName");
    cookies.remove("userId");
};
