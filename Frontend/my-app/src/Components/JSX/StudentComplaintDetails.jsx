import { useParams } from "react-router-dom"
import ComplaintDetails from "./ComplaintDetails"
import NavBar from "./NavBar"
import ReviewHistory from "./ReviewHistory"

const StudentComplaintDetails = () =>{

        const { complaint_id } = useParams()

    return(
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
                            <ComplaintDetails complaint_id={complaint_id} />

                        </div>

                        {/* RIGHT PANEL (1/3 width) */}
                        <div className="bg-gradient-to-b p-6 from-gray-50 to-gray-100 rounded-xl border border-gray-300 shadow-md flex flex-col">
                            <ReviewHistory complaint_id={complaint_id} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentComplaintDetails