import { useEffect, useState } from "react";

const ReviewHistory = ({complaint_id}) => {

    const [history, setHistory] = useState({})

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

    useEffect(() => {
        const get_review_history = async() =>{
            const userid = sessionStorage.getItem("user_id")
            try {
                const res = await fetch(`http://127.0.0.1:8000/complaints/review-history`,{
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userid,
                        complaint_id: complaint_id
                    })
                })
                const data = await res.json();
                setHistory(data);
                console.log(data)
            } catch (error) {
                console.error(error)
            }
        }

        if (complaint_id) {
            get_review_history();
        }
    },[complaint_id])

    return(
        <>
            <div className="border-b border-gray-400">
                <h3 className="mb-2 text-xl font-bold text-gray-700">
                    Review History
                </h3>
            </div>

            <div className="flex-1 pt-5 space-y-5">
                {Object.keys(history).length > 0 ? (

                    Object.entries(history).map(([stepId, actions]) => (
                        <div
                            key={stepId}
                            className="bg-white rounded-xl border border-gray-300 shadow-sm"
                        >

                            {/* Step Header */}
                            <div className="px-4 py-3 rounded-t-xl border-b border-gray-200 bg-red-50">
                                <h4 className="text-sm font-bold text-red-600">
                                    Workflow Step #{stepId}
                                </h4>
                            </div>

                            {/* Actions under this step */}
                            <div className="p-4 space-y-4">

                                {actions.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`relative border-l-2 pl-4 border-red-600`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {item.acted_by}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.role}
                                                </p>
                                            </div>

                                            <span
                                                className={`text-xs px-3 py-1 rounded-full font-semibold
                                                    ${item.action === "REQUEST_INFO"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : item.action === "APPROVED"
                                                            ? "bg-green-100 text-green-700"
                                                            : item.action === "REJECTED"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-gray-100 text-gray-600"
                                                    }
                                                `}
                                            >
                                                {item.action.replace("_", " ")}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-700 leading-relaxed mt-2">
                                            {item.note}
                                        </p>

                                        <div className="mt-2 flex flex-row items-center justify-between">
                                            {item.isPrivate !== undefined && (
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${item.isPrivate
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-green-100 text-green-600"
                                                        }`}
                                                >
                                                    {item.isPrivate ? "Private" : "Public"}
                                                </span>
                                            )}

                                            <span className="text-xs text-gray-500 text-right">
                                                {formatDateTime(item.acted_at)}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    ))

                ) : (
                    <p className="text-gray-500 text-sm text-center">
                        No review history available.
                    </p>
                )}
            </div>
        </>
    )
}

export default ReviewHistory