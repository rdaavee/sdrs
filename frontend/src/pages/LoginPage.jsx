import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import studentImg from "../assets/svgs/login-img.svg";
import logoImg from "../assets/images/phinma-cservice-logo.png";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative min-h-screen font-[TrebuchetMS,sans-serif]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3A4F24] to-[#E8E4E9] z-0"></div>
            <div
                className="hidden md:block absolute top-0 right-0 w-[60%] h-full bg-cover bg-center z-10"
                style={{ backgroundImage: `url(${studentImg})` }}
            ></div>

            <div className="relative z-20 container mx-auto px-6">
                <div className="flex items-center min-h-screen">
                    <div className="w-full md:w-1/2 lg:w-2/5">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8">
                            <div className="flex flex-col items-center mb-2">
                                <img
                                    src={logoImg}
                                    alt="UPang Logo"
                                    className="h-[110px] mb-4"
                                />
                                <h2 className="text-white font-semibold text-3xl">
                                    Admin Login
                                </h2>
                            </div>

                            <p className="text-white font-light mb-7 text-center">
                                Enter the details below
                            </p>

                            <form autoComplete="off" className="space-y-4">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full rounded-md px-5 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    required
                                />

                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        placeholder="Password"
                                        className="w-full rounded-md px-5 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash size={20} />
                                        ) : (
                                            <FaEye size={20} />
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-white text-sm">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4"
                                        />
                                        <span>Remember me</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#03b335] hover:bg-[#218838] text-white py-3 rounded-md font-semibold transition"
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
