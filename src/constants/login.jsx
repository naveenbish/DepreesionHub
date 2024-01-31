import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    const handleLogin = () => {
        console.log("User is attempting to log in");
        // You can add more code here to handle any pre-login logic
        loginWithRedirect();
    };

    return !isAuthenticated && (
        <button onClick={handleLogin}>
            Log In
        </button>
    );
};

export default LoginButton;
