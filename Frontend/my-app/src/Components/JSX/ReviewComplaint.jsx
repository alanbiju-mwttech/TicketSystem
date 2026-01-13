import { useNavigate } from "react-router-dom"
import NavBar from "./NavBar"
import { useEffect, useState } from "react"

const ReviewComplaint = () =>{

    const [complaints, setComplaints] = useState([])
    const navigate = useNavigate()

    const get_complaints = async() =>{
        const user_id = sessionStorage.getItem('user_id')
        try {
            const res = await fetch(`http://127.0.0.1:8000/complaints/pending`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"user_id": user_id})
            })

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Delete WorkFlow Failed");
            }

            const data = await res.json()
            setComplaints(data)
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }

    const review_Each_Complaint = (complaint_id) =>{
        navigate(`/complaints/${complaint_id}/act`)
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

    useEffect(() =>{
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
                                    <th className="px-3 py-4 w-1/3">Status</th>
                                    <th className="px-3 py-4 text-center">Created At</th>
                                    <th className="px-3 py-4 text-center">Current WorkFlow Step</th>
                                </tr>
                            </thead>
                            <tbody className="h-1 overflow-y-scroll">
                                {complaints.length > 0 ? (
                                    complaints.map((complaint, index) => (
                                        <tr 
                                            onClick={() => {review_Each_Complaint(complaint.complaint_id)}}
                                            key={complaint.complaint_id}
                                            className="border-b border-gray-200 hover:bg-red-50 transition cursor-pointer"
                                        >
                                            <td className="px-3 py-4 font-semibold">
                                                {index + 1}
                                            </td>

                                            <td className="px-3 py-4 font-semibold">
                                                {complaint.subject}
                                            </td>

                                            <td className="px-3 py-4 font-semibold">
                                                {complaint.status}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {formatDateTime(complaint.created_at)}
                                            </td>

                                            <td className="px-3 py-4 font-semibold text-center">
                                                {complaint.step_order}
                                            </td>
                                        </tr>

                                    ))
                                ) :
                                    (
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
export default ReviewComplaint