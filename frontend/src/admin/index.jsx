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

    return (
        <>
            {isLoading ? (
                <div>Loading </div>
            ) : (
                <>{isLoggedIn ? <Dashboard /> : <LoginPage />}</>
            )}
        </>
    );
}
