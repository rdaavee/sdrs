import axios from "axios";

const ROUTE = `${import.meta.env.VITE_API_URL}/request`;
export const getRequestReceipt = async (reference_number, code) => {
    try {
        const response = await axios.get(`${ROUTE}/get-request-receipt`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
            params: { reference_number, code },
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

        const data = response.data;
        return data.message;
    } catch (error) {
        const axiosError = error;
        const errMsg = axiosError.response?.data?.error || "Unknown error";
        return errMsg;
    }
};

export const getAllRequestReceipt = async () => {
    try {
        const response = await axios.get(`${ROUTE}/get-all-request-receipt`, {
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

export const getAllRequestReceiptStats = async () => {
    try {
        const response = await axios.get(
            `${ROUTE}/get-all-request-receipt-stats`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = response.data;
        return data.message;
    } catch (error) {
        const axiosError = error;
        const errMsg = axiosError.response?.data?.error || "Unknown error";
        return errMsg;
    }
};

export const updateRequestStatus = async (id, newStatus) => {
    try {
        console.log("sending update:", { id, newStatus });
        const response = await axios.put(
            `${ROUTE}/update/${id}`,
            { status: newStatus },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );

        return response.data;
    } catch (error) {
        const axiosError = error;
        console.error("updateRequestStatus error:", axiosError.response?.data || axiosError.message);
        throw new Error(
            axiosError.response?.data?.error || "Failed to update status"
        );
    }
};


export const actionRequest = async (id, action) => {
    if (!["accepted", "rejected"].includes(action)) {
        throw new Error("Invalid action type");
    }

    return await updateRequestStatus(id, action);
};