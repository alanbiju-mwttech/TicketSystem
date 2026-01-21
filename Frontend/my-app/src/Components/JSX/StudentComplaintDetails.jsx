import { useParams } from "react-router-dom"
import ComplaintDetails from "./ComplaintDetails"
import NavBar from "./NavBar"
import ReviewHistory from "./ReviewHistory"
import { useState } from "react"

const StudentComplaintDetails = () =>{

    const { complaint_id } = useParams()
    const [note, setNote] = useState("")
    const [isPaused, setIsPaused] = useState(false)
    const [infoRequested, setInfoRequested] = useState(false)

    const handlePausedStatus = (paused) => {
        setIsPaused(paused)
    }

    const onInfoRequested = (request) => {
        setInfoRequested(request)
    }

    const review_complaint = async (payload) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/complaint/info-response`, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(payload)
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to resolve complaint.");
            }
            alert("Successfully Reviewed the Query!!....")

        } catch (error) {
            console.error(error)
        }
    }

    const submitReview = async () => {
        if (note.trim() === "") {
            alert("Please add the info note.");
            return;
        }

        const user_id = sessionStorage.getItem('user_id')
        const payload = {
            complaint_id: complaint_id,
            note: note,
            acted_by: user_id,
        }
        await review_complaint(payload)
        window.location.reload();
    }

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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-7 py-7">

                        {/* LEFT PANEL (2/3 width) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Complaint Details */}
                            <ComplaintDetails 
                                complaint_id={complaint_id}
                                onPausedStatus={handlePausedStatus}
                                onInfoRequested={onInfoRequested}
                            />

                            {isPaused === true && infoRequested === true &&(
                                <div className="bg-white p-6 rounded-xl border border-red-200 shadow-md ring-1 ring-red-100">
                                    <h3 className="text-xl font-bold text-gray-700 mb-3">
                                        Give more Info
                                    </h3>

                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                                        placeholder="Add on more details as requested by the reviewer..."
                                    />
                                    <button
                                        onClick={submitReview}
                                        className="mt-2 bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-bold shadow-md transition"
                                    >
                                        Send Info
                                    </button>
                                </div>
                            )}

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