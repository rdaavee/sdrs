const getStatusStyle = (status) => {
    switch (status) {
        case "processing":
            return "bg-yellow-100 text-yellow-700";
        case "ready":
            return "bg-green-100 text-green-700";
        case "waiting":
            return "bg-gray-100 text-gray-700";
        case "released":
            return "bg-blue-100 text-blue-700";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

export default getStatusStyle;
