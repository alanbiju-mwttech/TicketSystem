import { useNavigate, useParams } from "react-router-dom"
import NavBar from "./NavBar"
import { useState } from "react"
import ComplaintDetails from "./ComplaintDetails"
import ReviewHistory from "./ReviewHistory"

const ComplaintAction = () => {
    
    const [note, setNote] = useState("")
    const [isPrivate, setIsPrivate] = useState(false);
    const { complaint_id } = useParams()
    const navigate = useNavigate()

    const [infoRequested, setInfoRequested] = useState(false)

    const onInfoRequested = (request) => {
        setInfoRequested(request)
    }

    const review_complaint = async(payload) =>{
        try {
            const response = await fetch(`http://127.0.0.1:8000/complaint/action`, {
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
            navigate(-1);
            alert("Successfully Reviewed the Query!!....")

        } catch (error) {
            console.error(error)
        }
    }

    const reject_complaint = async (payload) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/complaint/reject`, {
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
            navigate(-1);
            alert("Successfully Rejected the Complaint!!....")

        } catch (error) {
            console.error(error)
        }
    }

    const request_info = async (payload) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/complaint/request-info`, {
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
            navigate(-1);
            alert("Successfully Requested more info!!....")

        } catch (error) {
            console.error(error)
        }
    }

    const submitReview = async() =>{
        if (infoRequested === true) {
            alert("The complaint is paused as more information is requested to the student...");
            return;
        }

        if (note.trim() === ""){
            alert("Please add the review note.");
            return;
        }

        const user_id = sessionStorage.getItem('user_id')
        const payload = {
            complaint_id: complaint_id,
            isPrivate: isPrivate,
            note: note,
            acted_by: user_id,
        }
        await review_complaint(payload)
    }

    const requestInfo = async () => {
        if (infoRequested === true) {
            alert("The complaint is paused as more information is requested to the student...");
            return;
        }

        if (note.trim() === "" ) {
            alert("Please add the review note...");
            return;
        }

        const user_id = sessionStorage.getItem('user_id')
        const payload = {
            complaint_id: complaint_id,
            note: note,
            acted_by: user_id,
        }
        await request_info(payload)
    }

    const rejectComplaint = async () => {
        if (infoRequested === true) {
            alert("The complaint is paused as more information is requested to the student...");
            return;
        }

        if (note.trim() === "") {
            alert("Please add the review note...");
            return;
        }

        const user_id = sessionStorage.getItem('user_id')
        const payload = {
            complaint_id: complaint_id,
            note: note,
            acted_by: user_id,
        }
        await reject_complaint(payload)
    }

    return (
        <>
            <NavBar />
            <div className="bg-gradient-to-br from-red-50 to-red-100 px-4 md:px-10 pt-[110px] pb-10">
                <div className="bg-white rounded-xl shadow-xl ring-1 ring-red-100">

                    {/* Header */}
                    <div className="px-6 py-6 border-b border-gray-300">
                        <h2 className="text-3xl font-bold text-red-600">
                            Resolve Complaint
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Review the complaint and submit your resolution note.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-7 py-6">

                        {/* LEFT PANEL (2/3 width) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Complaint Details */}
                            <ComplaintDetails 
                                complaint_id={complaint_id}
                                onInfoRequested={onInfoRequested}
                            />

                            {/* Add Review */}
                            <div className="bg-white p-6 rounded-xl border border-red-200 shadow-md ring-1 ring-red-100">
                                <h3 className="text-xl font-bold text-gray-700 mb-3">
                                    Add Review Note
                                </h3>

                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                                    placeholder="Describe the action taken or your review..."
                                />

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-gray-700">
                                            {isPrivate ? "Private" : "Public"}
                                        </span>

                                        <div className="relative inline-block w-11 h-5">
                                            <input
                                                type="checkbox"
                                                checked={isPrivate}
                                                onChange={() => setIsPrivate(!isPrivate)}
                                                className="peer appearance-none w-11 h-5 bg-slate-200 rounded-full checked:bg-red-600 cursor-pointer transition-colors duration-300"
                                            />

                                            <span
                                                className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300
                                                    peer-checked:translate-x-6 peer-checked:border-red-600 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={rejectComplaint}
                                        disabled={infoRequested === true}
                                        className={`px-4 py-2 font-bold rounded-md transition 
                                            ${ infoRequested === true
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-red-600 text-white hover:bg-red-800 cursor-pointer"
                                            }
                                    `}>
                                        Reject Query
                                    </button>

                                    <button
                                        onClick={requestInfo}
                                        disabled={infoRequested === true}
                                        className={`px-4 py-2 font-bold rounded-md transition 
                                            ${infoRequested === true
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-yellow-300 hover:bg-yellow-500 text-black cursor-pointer"
                                            }
                                    `}>
                                        Request Info
                                    </button>

                                    <button
                                        onClick={submitReview}
                                        disabled={infoRequested === true}
                                        className={`px-4 py-2 font-bold rounded-md transition 
                                            ${infoRequested === true
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-800 text-white cursor-pointer"
                                            }
                                    `}>
                                        
                                        Approve Query
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANEL (1/3 width) */}
                        <div className="bg-gradient-to-b p-6 from-gray-50 to-gray-100 rounded-xl border border-gray-300 shadow-md flex flex-col">
                            <ReviewHistory complaint_id={complaint_id}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ComplaintAction