import { useEffect, useState } from "react";
import { authenticateToken } from "../services/admin";
import Dashboard from "./Dashboard";
import LoginPage from "../pages/LoginPage";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        authenticateToken()
            .then((isValid) => {
                setIsLoggedIn(isValid);
            })
            .catch((e) => console.error(e))
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="relative h-screen w-screen overflow-hidden">
                <div className="absolute inset-0">
                    <div className="h-full w-full filter blur-md">
                        <LoginPage />
                    </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            {isLoggedIn ? <Dashboard /> : <LoginPage />}
        </>
    );
}
