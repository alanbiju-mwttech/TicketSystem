import { useEffect, useState } from "react";

const ReviewHistory = ({complaint_id}) => {

    const [history, setHistory] = useState([])

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
            try {
                const res = await fetch(`http://127.0.0.1:8000/complaints/${complaint_id}/review-history`,{
                    method: "GET"
                })
                const data = await res.json();
                setHistory(data);
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

                {history.length > 0 ? (
                    history.map((item, index) => (
                        <div
                            key={index}
                            className="relative bg-white p-4 rounded-lg border border-gray-200 border-l-4 border-l-red-600 shadow-md"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {item.reviewer_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {item.role}
                                    </p>
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-300 font-semibold">
                                    Reviewed
                                </span>
                            </div>

                            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                                {item.note}
                            </p>

                            <p className="text-xs text-gray-500 text-right">
                                {formatDateTime(item.acted_at)}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm text-center">
                        No reviews yet.
                    </p>
                )}

            </div>
        </>
    )
}

export default ReviewHistory