import { useEffect, useState } from "react";

const ComplaintDetails = ({ complaint_id, onPausedStatus, onInfoRequested }) => {
    const [complaint, setComplaint] = useState(null)

    useEffect(() => {
        const get_complaint = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/complaints/${complaint_id}/act`
                )
                const data = await response.json()
                setComplaint(data)

                // 🔑 Send is_paused to parent
                if (onPausedStatus) {
                    onPausedStatus(data[0].is_paused)
                }
                onInfoRequested?.(data[0].current_action === "REQUEST_INFO")

            } catch (error) {
                console.error(error)
            }
        }

        if (complaint_id) {
            get_complaint()
        }
    }, [complaint_id, onPausedStatus, onInfoRequested])  

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

    if (!complaint) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading complaint...
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border border-red-300 shadow-md">
            <h3 className="text-xl font-bold text-red-600 mb-4 border-b border-red-200 pb-2">
                Complaint Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <p><span className="font-semibold">Complaint ID:</span> {complaint[0].complaint_id}</p>
                <p><span className="font-semibold">Registered By:</span> {complaint[0].name}</p>
                <p><span className="font-semibold">Registered At:</span> {formatDateTime(complaint[0].created_at)}</p>

                <p className="md:col-span-2">
                    <span className="font-semibold">Subject:</span> {complaint[0].subject}
                </p>

                <p className="md:col-span-2 text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-700">Description:</span><br />
                    {complaint[0].description}
                </p>

                <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={`px-3 py-1 rounded-full  text-white text-xs font-bold shadow
                            ${complaint[0].status === "RESOLVED" ? 
                                "bg-gradient-to-r from-green-800 to-green-600" : "bg-gradient-to-r from-red-600 to-red-500"
                            }
                        `}>
                        {complaint[0].status}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ComplaintDetails;
