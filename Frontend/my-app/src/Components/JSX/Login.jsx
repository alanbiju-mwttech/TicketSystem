import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = "Username is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

    const loginFunction = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Login failed");
            }

            const data = await response.json();

            sessionStorage.setItem("user_id", data.user_id);
            sessionStorage.setItem("role", data.role);
            sessionStorage.setItem("isLoggedIn", "true");

            navigate("/");

        } catch (error) {
            setApiError(error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setApiError("");
        loginFunction();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
                    Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 transition-all ${errors.username
                                    ? "border-red-500 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-red-500"
                                }`}
                            placeholder="username"
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 transition-all ${errors.password
                                    ? "border-red-500 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-red-500"
                                }`}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {apiError && (
                        <p className="text-sm text-center text-red-600">
                            {apiError}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <span className="text-red-600 font-medium cursor-pointer">
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;