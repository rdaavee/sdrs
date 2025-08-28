import React, { useRef } from "react";
import user from "../../../assets/images/user-img.png";

const MyProfile = () => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            console.log("file selected", file.name);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleDelete = () => {
        alert("photo deleted");
    };

    return (
        <>
            <div className="w-full profile-container">
                <h2 className="text-3xl font-[500] text-black py-2">
                    My Profile
                </h2>
                <div className="w-full bg-white p-10 rounded-3xl shadow-xs mt-10">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center sm:items-center space-x-4 mb-6">
                        <img
                            src={user}
                            alt="user-img"
                            className="w-20 h-20 rounded-full object-cover"
                        />
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/"
                                onClick={handleFileChange}
                            />
                            <button
                                onClick={handleUploadClick}
                                className="bg-[#03b335] hover:bg-[#218838] text-white transition-colors duration-300 text-xs px-5 py-2 rounded-md"
                            >
                                upload new photo
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-gray-500 hover:text-red-500 transition-colors duration-300 text-xs px-5 py-2 rounded-md"
                            >
                                delete
                            </button>
                        </div>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 mb-2">
                            <label className="block text-lg mb-2 leading-[28px] font-[400]">
                                Name
                            </label>
                            <input type="text" placeholder="Ranier Tan" />
                        </div>

                        <div className="mb-2">
                            <label className="block text-lg mb-2 leading-[28px] font-[400]">
                                Role
                            </label>
                            <input type="text" placeholder="Super Admin" />
                        </div>

                        <div className="mb-2">
                            <label className="block text-lg mb-2 leading-[28px] font-[400]">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="superadmin1@phinmaed.com"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default MyProfile;
