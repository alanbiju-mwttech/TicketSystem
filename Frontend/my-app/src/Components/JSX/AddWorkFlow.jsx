import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

const AddWorkFlow = () => {
    const navigate = useNavigate();

    const [workflowName, setWorkflowName] = useState("");
    const [steps, setSteps] = useState([{ role: "" }]);
    const [ROLES, setRoles] = useState([])
    const [apiError, setApiError] = useState("");
    
    const getRoles = async () =>{
        try {
            const response = await fetch(`http://127.0.0.1:8000/get-roles`, {
                method: 'GET',
            })
            const popular_songs = await response.json()
            // console.log(popular_songs)
            setRoles(popular_songs)
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(()=>{
        getRoles()
    },[])   

    const handleChange = (index, value) => {
        const updated = [...steps];
        updated[index].role = value;
        setSteps(updated);
    };

    const addStep = () => {
        if (!steps[steps.length - 1].role) return;
        setSteps([...steps, { role: "" }]);
    };

    const removeStep = (index) => {
        if (steps.length === 1) return;
        setSteps(steps.filter((_, i) => i !== index));
    };

    const addWorkFlow = async (payload) =>{
        console.log(payload)
        try {
            const response = await fetch(`http://127.0.0.1:8000/add-workflow`,{
                method: "POST",
                headers: {
                    "Content-Type" :'application/json'
                },
                body: JSON.stringify(payload)
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Login failed");
            }

            navigate("/");
            alert("WorkFlow Added Successfully!!....")

        } catch (error) {
            setApiError(error.message)
        }
    }

    const handleSubmit = () => {
        if (steps.some(step => !step.role)) {
            alert("Please complete all workflow steps.");
            return;
        }

        const payload = {
            name: workflowName,
            steps: steps.map((s, i) => ({
                step_order: i + 1,
                role: s.role
            }))
        };

        setApiError("")
        addWorkFlow(payload)
    };

    return (
        <>
            <NavBar />
            <div className="bg-red-50 flex justify-center pt-[115px]">
                <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-0 max-h-[calc(100vh-120px)] overflow-y-auto">

                    <div className="sticky top-0 bg-white z-10 py-4">
                        <h2 className="text-3xl font-bold text-center text-red-600">
                            Create Workflow
                        </h2>
                        <p className="text-center text-gray-500 text-sm">
                            Define the approval steps for complaint resolution
                        </p>
                    </div>

                    <div className="space-y-2 px-6">
                        <input
                            type="text"
                            name="name"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                            className={"mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-red-500"}
                            placeholder="Enter WorkFlow Name"
                        />
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 rounded-lg p-4"
                            >
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white font-bold">
                                    {index + 1}
                                </div>

                                <select
                                    value={step.role}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                                >
                                    <option value="">Select Role</option>
                                    {ROLES.map(role => (
                                        <option className="font-medium" key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>

                                {steps.length > 1 && (
                                    <button
                                        onClick={() => removeStep(index)}
                                        className="text-red-500 font-bold text-xl hover:text-red-700"
                                        title="Remove Step"
                                    >
                                        x
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {apiError && (
                        <p className="text-sm text-center text-red-600">
                            {apiError}
                        </p>
                    )}

                    <div className="w-full sticky bottom-0 flex justify-between items-center mt-8 bg-white px-6 pb-6 pt-3 shadow-lg">
                        <button
                            onClick={addStep}
                            className="flex items-center gap-2 text-red-600 font-semibold hover:underline"
                        >
                            + Add Another Step
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="bg-red-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-700 transition"
                        >
                            Save Workflow
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddWorkFlow;