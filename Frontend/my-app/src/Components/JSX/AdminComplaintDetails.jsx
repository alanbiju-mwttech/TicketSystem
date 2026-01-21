import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import ReviewHistory from "./ReviewHistory";
import { useParams } from "react-router-dom";

const AdminComplaintDetails = () => {

    const { complaint_id } = useParams()
 
    const [complaint, setComplaint] = useState(null);

    useEffect(() => {
        const get_complaint = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/complaints/${complaint_id}/act`
                );
                const data = await response.json();
                setComplaint(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (complaint_id) {
            get_complaint();
        }
    }, [complaint_id]);

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
        <>
        <NavBar />
        <div className="bg-gradient-to-br from-red-50 to-red-100 px-4 md:px-10 pt-[110px] pb-10">
            <div className="bg-white rounded-xl shadow-xl ring-1 ring-red-100">

                {/* Header */}
                <div className="px-6 py-6 border-b border-gray-300">
                    <h2 className="text-3xl font-bold text-red-600">
                        Complaint Status
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        View your complaint's current status.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-7 py-6">

                    {/* LEFT PANEL (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Complaint Details */}
                        <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border border-red-300 shadow-md">
                            <h3 className="text-xl font-bold text-red-600 mb-4 border-b border-red-200 pb-2">
                                Complaint Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                <p><span className="font-semibold">Complaint ID:</span> {complaint[0].complaint_id}</p>
                                <p><span className="font-semibold">Registered By:</span> {complaint[0].name}</p>
                                <p><span className="font-semibold">Registered At:</span> {formatDateTime(complaint[0].created_at)}</p>
                                <p><span className="font-semibold">Workflow Id:</span> {complaint[0].workflow_id}</p>

                                <p className="md:col-span-2">
                                    <span className="font-semibold">Subject:</span> {complaint[0].subject}
                                </p>

                                <p className="md:col-span-2 text-gray-600 leading-relaxed">
                                    <span className="font-semibold text-gray-700">Description:</span><br />
                                    {complaint[0].description}
                                </p>

                                <p>
                                    <span className="font-semibold">Status:</span>{" "}
                                    <span className={`px-3 py-1 rounded-full text-white text-xs font-bold shadow
                                        ${complaint[0].status === "RESOLVED" ?
                                            "bg-gradient-to-r from-green-800 to-green-600" : "bg-gradient-to-r from-red-600 to-red-500"
                                        }
                                    `}>
                                        {complaint[0].status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL (1/3 width) */}
                    <div className="bg-gradient-to-b p-6 from-gray-50 to-gray-100 rounded-xl border border-gray-300 shadow-md flex flex-col">
                        <ReviewHistory complaint_id={complaint_id} />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default AdminComplaintDetails;
