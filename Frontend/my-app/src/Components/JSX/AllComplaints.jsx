import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";

const AllComplaints = () => {

    const navigate = useNavigate()
    const [complaints, setComplaints] = useState([])

    const get_complaints = async () => {
        const user_id = sessionStorage.getItem('user_id')
        try {
            const res = await fetch(`http://127.0.0.1:8000/get-all-complaints`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "studentId": user_id })
            })

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Delete WorkFlow Failed");
            }

            const data = await res.json()
            console.log(data)
            setComplaints(data)
        } catch (error) {
            console.error(error)
        }
    }

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

    const review_Each_Complaint = (complaint_id) => {
        navigate(`/admin/complaints/${complaint_id}`)
    }

    useEffect(()=>{
        get_complaints()
    },[])

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-red-50 px-4 md:px-10 pt-[110px] pb-10">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden pb-10">

                    {/* Header */}
                    <div className="px-6 py-6 flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-3xl max-md:text-xl font-bold text-red-600">
                                All Complaints
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 pr-3">
                                List of all complaints you have registered.
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <hr className="mx-6 mb-7 border-t border-gray-300" />
                    <div className="px-10 relative max-h-[calc(100vh-370px)] overflow-y-auto">
                        <table className="w-full text-left min-w-[550px] border-collapse">
                            <thead className="sticky top-0 z-20 bg-red-200 text-red-700 text-sm uppercase">
                                <tr>
                                    <th className="px-3 py-4">#</th>
                                    <th className="px-3 py-4 w-1/5">Subject</th>
                                    <th className="px-3 py-4 w-1/4">Description</th>
                                    <th className="px-3 py-4 text-center">WorkFlow Id</th>
                                    <th className="px-3 py-4 text-center">Status</th>
                                    <th className="px-3 py-4 text-center">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="h-1 overflow-y-scroll">
                                {complaints.length > 0 ? (
                                    complaints.map((complaint, index) => (
                                        <tr
                                            key={complaint.complaint_id}
                                            className="border-b border-gray-200 hover:bg-red-50 transition cursor-pointer"
                                            onClick={() => { review_Each_Complaint(complaint.complaint_id) }}
                                        >
                                            <td className="px-3 py-4 font-semibold">
                                                {index + 1}
                                            </td>

                                            <td className="px-3 py-4 font-semibold">
                                                {complaint.subject}
                                            </td>

                                            <td className="px-3 py-4 font-semibold">
                                                {complaint.description}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {complaint.workflow_id}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {complaint.status}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {formatDateTime(complaint.created_at)}
                                            </td>
                                        </tr>

                                    ))
                                ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center py-10 text-gray-500"
                                            >
                                                No Complaints added yet.
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllComplaints