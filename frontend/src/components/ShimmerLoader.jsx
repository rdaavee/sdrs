import React from "react";

const ShimmerLoader = () => {
    return (
        <div className="animate-pulse py-2 space-y-5">
            <div className="h-9 bg-gray-200 rounded w-1/8"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-6 gap-10 py-4">
                <div className="h-32 bg-gray-200 rounded-3xl"></div>
                <div className="h-32 bg-gray-200 rounded-3xl"></div>
                <div className="h-32 bg-gray-200 rounded-3xl hidden md:block"></div>
                <div className="h-32 bg-gray-200 rounded-3xl hidden xl:block"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-6 gap-10 pt-5">
                <div className="h-150 bg-gray-200 rounded-2xl"></div>
                <div className="h-150 bg-gray-200 rounded-2xl hidden lg:block"></div>
            </div>
        </div>
    );
};

export default ShimmerLoader;
