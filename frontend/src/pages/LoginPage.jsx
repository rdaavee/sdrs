import { ToastContainer, toast } from "react-toastify";
import { motion } from 'framer-motion';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import studentImg from "../assets/svgs/login-img.svg";
import logoImg from "../assets/images/phinma-cservice-logo.png";
import { cookies, login } from "../services/admin";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [dataForm, setDataForm] = useState({
        user_identifier: "",
        password: "",
    });

    const handleInputChange = (key, value) => {
        setDataForm((prev) => ({ ...prev, [key]: value }));
    };
    const loginButton = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!dataForm.password || !dataForm.user_identifier) {
            setLoading(false);
            toast.error("Please fill in all fields.", {
                position: "top-right",
                autoClose: 1700,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            }); 
            return;
        }

        const result = await login(dataForm);

        if (result.message !== "Success") {
            setLoading(false);
            toast.error("Invalid credentials, please try again.", {
                position: "top-right",
                autoClose: 1700,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        setLoading(false);

        toast.success("Login successful!", {
            position: "top-right",
            autoClose: 1200,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        console.log(result);
        cookies.set("authorization", result.access_token);
        cookies.set("role", result.role);
        cookies.set("user_id", result.user_id);
        cookies.set("full_name", result.full_name);
        cookies.set("email_address", result.email_address);

        // navigate("/");
        setTimeout(() => {
            window.location.reload();
        }, 1200);
    };

    // if (loading) return <div>Loading</div>;
    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3A4F24] to-[#E8E4E9] z-0"></div>
            <motion.div
                className="hidden md:block absolute top-0 right-0 w-[60%] h-full bg-cover bg-center z-10"
                initial={{ opacity: .3, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: .7 }}
                style={{ backgroundImage: `url(${studentImg})` }}>
            </motion.div>

            <div className="relative z-20 container mx-auto px-6">
                <div className="flex items-center min-h-screen">
                    <motion.div className="w-full md:w-1/2 lg:w-2/5"
                        initial={{ opacity: .3, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: .7 }}>
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
                            <div className="flex flex-col items-center mb-2">
                                <img
                                    src={logoImg}
                                    alt="UPang Logo"
                                    className="h-[150px] mb-3"
                                />
                                <h2 className="text-white font-semibold text-3xl tracking-tight">
                                    Student Document Request System
                                </h2>
                            </div>

                            <p className="text-white font-light mb-7 text-center tracking-tight">
                                Login to connect to the dashboard
                            </p>

                            <div className="space-y-4">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full rounded-md px-5 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    required
                                    onChange={(e) =>
                                        handleInputChange(
                                            "user_identifier",
                                            e.target.value
                                        )
                                    }
                                    value={dataForm.user_identifier}
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
                                        onChange={(e) =>
                                            handleInputChange(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        value={dataForm.password}
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
                                    className="w-full bg-[#03b335] hover:bg-[#218838] text-white py-3 rounded-md font-semibold transition cursor-pointer"
                                    onClick={loginButton}
                                    disabled={loading}
                                >
                                    {loading ? "Loading..." : "Login"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default LoginPage;
