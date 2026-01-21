import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

const AllWorkFlow = () => {
    const [workflows, setWorkflows] = useState([]);
    const [activeWorkflowId, setActiveWorkflowId] = useState(null);
    const [initialActiveId, setInitialActiveId] = useState(null);
    const [deleteWorkFlow, setDeleteWorkFlow] = useState(null)

    const navigate = useNavigate()

    const get_workflows = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/get-workflows");
            const data = await response.json();

            setWorkflows(data);

            const active = data.find(w => w.isActive === "Active");
            if (active) {
                setActiveWorkflowId(active.workflow_id);
                setInitialActiveId(active.workflow_id);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        get_workflows();
    }, []);

    const handleActiveChange = (workflowId) => {
        if (workflowId === deleteWorkFlow) {
            alert("Can't make a workflow which is set to delete.")
            return
        }
        setActiveWorkflowId(workflowId);
    };

    const handleDelete = (workflowId) => {
        setDeleteWorkFlow(workflowId)
    };

    const isDeleteDisabled = (workflowId) => {
        return (
            workflowId === activeWorkflowId ||
            workflowId === initialActiveId ||
            workflowId === deleteWorkFlow
        );
    };    

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const handleSave = async() => {
        if (activeWorkflowId !== initialActiveId){
            try {
                const response = await fetch(`http://127.0.0.1:8000/set-active`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({"workflow_id": activeWorkflowId})
                })
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Set Active Failed");
                }
    
                const data = await response.json()
                console.log(data)
                setInitialActiveId(activeWorkflowId)
                get_workflows()
    
            } catch (error) {
                console.error(error)
            }  
        }
        if (deleteWorkFlow !== null){
            try {
                const response = await fetch(`http://127.0.0.1:8000/delete-workflow`, {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ "workflow_id": deleteWorkFlow })
                })

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Delete WorkFlow Failed");
                }

                const data = await response.json()
                console.log(data)
                setDeleteWorkFlow(null)
                get_workflows()

            } catch (error) {
                console.error(error)
            }
        }
    };

    const hasChanges = activeWorkflowId !== initialActiveId || deleteWorkFlow !== null;

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-red-50 px-4 md:px-10 pt-[110px] pb-10">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">

                    {/* Header */}
                    <div className="px-6 py-6 flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-3xl max-md:text-xl font-bold text-red-600">
                                Manage Workflows
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 pr-3">
                                Only one workflow can be active at a time.
                            </p>
                        </div>
                        <div>
                            <button className="px-6 py-2 rounded-lg font-semibold transition bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                                onClick={() => { navigate('/addWorkFlow')}}
                            >Add WorkFlow</button>
                        </div>
                    </div>

                    {/* Table */}
                    <hr className="mx-7 mb-7 border-t border-gray-300"/>
                    <div className="px-10 relative max-h-[calc(100vh-370px)] overflow-y-auto">
                        <table className="w-full text-left min-w-[550px] border-collapse">
                            <thead className="sticky top-0 z-20 bg-red-200 text-red-700 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Workflow Name</th>
                                    <th className="px-6 py-4">Created At</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                    <th className="px-6 py-4 text-center">Delete</th>
                                </tr>
                            </thead>

                            <tbody className="h-1 overflow-y-scroll">
                                {workflows.length > 0 ? (
                                    workflows.map((workflow, index) => (
                                        <tr
                                            key={workflow.workflow_id}
                                            className="border-b border-gray-200 hover:bg-red-50 transition"
                                        >
                                            <td className={`px-6 py-4 font-semibold
                                                    ${deleteWorkFlow === workflow.workflow_id ?
                                                        "line-through text-red-500"
                                                        : ""
                                                    }
                                                `}>
                                                {index + 1}
                                            </td>

                                            <td className={`px-6 py-4 font-semibold 
                                                    ${deleteWorkFlow === workflow.workflow_id ?
                                                    "line-through text-red-500"
                                                    : ""
                                                }
                                                `}>
                                                {workflow.workflow_name}
                                            </td>

                                            <td className={`px-6 py-4 font-semibold
                                                    ${deleteWorkFlow === workflow.workflow_id ?
                                                    "line-through text-red-500"
                                                    : ""
                                                }
                                                `}>
                                                {formatDateTime(workflow.created_at)}
                                            </td>

                                            <td className={`px-6 py-4 font-semibold text-center
                                                    ${deleteWorkFlow === workflow.workflow_id ?
                                                    "line-through text-red-500"
                                                    : ""
                                                }
                                                `}>
                                                {initialActiveId === workflow.workflow_id ? (
                                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-600">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 flex justify-center items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleActiveChange(workflow.workflow_id)}
                                                    className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center transition cursor-pointer"aria-label="Set active workflow">
                                                    {activeWorkflowId === workflow.workflow_id && (
                                                        <span className="w-3 h-3 rounded-full bg-red-600" />
                                                    )}
                                                </button>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            workflow.workflow_id
                                                        )
                                                    }
                                                    disabled={isDeleteDisabled(workflow.workflow_id)}
                                                    className={`px-3 py-1 text-sm rounded-md transition
                                                            ${isDeleteDisabled(workflow.workflow_id)
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : "bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                                                        }
                                                    `}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-10 text-gray-500"
                                        >
                                            No workflows added yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <hr className="mx-7 border-t border-gray-300" />

                    {/* Save Button */}
                    <div className="flex justify-center px-6 py-5">
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className={`px-6 py-2 rounded-lg font-semibold transition
                                ${hasChanges
                                    ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }
                            `}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllWorkFlow;