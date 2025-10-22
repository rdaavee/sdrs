import axios from "axios";
import Cookies from "universal-cookie";

export const cookies = new Cookies();

const ROUTE = `/api/admin`;

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

export const editAdminAccount = async (dataForm) => {
    try {
        const response = await axios.post(`${ROUTE}/edit-user`, dataForm, {
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
        console.log(data.message);
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
export const logoutMethod = () => {
    console.log("rrnign");
    cookies.remove("authorization");
    cookies.remove("role");
    cookies.remove("user_id");
    cookies.remove("full_name");
    cookies.remove("email_address");
};
