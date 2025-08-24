const getStatusStyle = (status) => {
    switch (status) {
        case "Processing":
            return "bg-yellow-100 text-yellow-700";
        case "Ready":
            return "bg-green-100 text-green-700";
        case "Waiting":
            return "bg-gray-200 text-gray-600";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

export default getStatusStyle;
