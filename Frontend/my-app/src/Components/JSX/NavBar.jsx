import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NavBar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-[rgb(var(--color-primary))] px-9 py-5 shadow-lg backdrop-blur-md">
            <h1 className="text-white text-2xl font-bold cursor-pointer" onClick={()=>{navigate('/')}}>
                Complaint Portal
            </h1>

            {isLoggedIn ? (
                <button
                    onClick={handleLogout}
                    className="rounded-md bg-white py-1 px-5 border border-transparent text-md font-bold text-[rgb(var(--color-primary))] transition-all shadow-md hover:shadow-lg active:bg-red-100"
                >
                    Logout
                </button>
            ) : (
                <button
                    onClick={() => navigate("/login")}
                    className="rounded-md bg-white py-1 px-5 border border-transparent text-md font-bold text-[rgb(var(--color-primary))] transition-all shadow-md hover:shadow-lg active:bg-red-100"
                >
                    Login
                </button>
            )}
        </div>
    );
};

export default NavBar;