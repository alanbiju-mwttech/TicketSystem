import { useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";


const ComplaintForm = () => {
    const studentId = sessionStorage.getItem('user_id')
    const [formData, setFormData] = useState({
        studentId: studentId,
        subject: "",
        description: "",
    });

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Complaint Registered:", formData);
        try {
            const res = await fetch("http://127.0.0.1:8000/register-complaint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed");

            navigate("/", {
                state: {
                    showSuccess: true,
                    message: "Complaint registered successfully"
                }
            });

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <NavBar />
            <div className="bg-red-50 flex justify-center pt-[115px]">
                <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
                        Register a Complaint
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* <div class="w-full max-w-lg min-w-[200px]">
                            <div class="relative">
                                <input
                                    id="contactNumber"
                                    name="studentName"
                                    value={formData.studentName}
                                    onChange={handleChange}
                                    class="peer w-full border border-red-300 bg-transparent placeholder:text-red-500 text-slate-700 text-sm rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-red-600 hover:border-red-500 shadow-sm focus:shadow"
                                    required
                                />
                                <label for="contactNumber" class="absolute cursor-text bg-white px-1 left-9 top-2.5 text-slate-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-10 peer-focus:text-m peer-focus:font-medium peer-focus:text-red-500 peer-focus:scale-90">
                                    e.g., +1 123-456-7890
                                </label>
                            </div>
                        </div> */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Complaint Title
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="Enter the Complaint title"
                                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                required
                                placeholder="Enter the Complaint Description"
                                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-red-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-800 text-white font-semibold py-2 rounded-md transition cursor-pointer"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ComplaintForm;