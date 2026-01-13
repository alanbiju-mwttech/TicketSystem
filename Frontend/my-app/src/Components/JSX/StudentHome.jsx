import '../CSS/StudentHome.css'
import ComplaintImage from "../../Assets/ComplaintRegister.png";
import TrackComplaint from "../../Assets/TrackComplaint.png";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const StudentHome = () =>{

    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
            const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
            setIsLoggedIn(loggedIn);
    }, []);

    useEffect(() => {
        if (location.state?.showSuccess) {
            setShowAlert(true);
            setMessage(location.state.message);

            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [location.state]);

    const Report_Issue = () => {
        isLoggedIn ? navigate('/register-complaint') : navigate('/login')
    }

    const View_Status = () => {
        isLoggedIn ? navigate('/view-status') : navigate('/login')
    }

    return(
        <>
            {showAlert && (
                <div className="fixed top-[120px] left-1/2 -translate-x-1/2 z-50">
                    <div className="animate-scale-fade w-full max-w-[395px] flex items-start sm:items-center p-3 m-4 text-md text-green-800 rounded-lg bg-green-200 border border-green-800" role="alert">
                        <svg class="w-4 h-4 me-2 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                        <p><span class="font-medium me-1">Success alert!</span> {message}</p>
                    </div>
                </div>
            )}
            <div className="main">
                <h2 className="text-4xl font-bold text-center text-gray-600 mt-5">
                    Welcome to Complaint Register Portal.
                </h2>
                <div className='box-grp'>
                    <div className="box shadow-2xl">
                        <div className="heading">
                            File a new Complaint
                        </div>
                        <div className="image">
                            <img src={ComplaintImage} alt="Complaint Register" />
                        </div>
                        <button className='button' onClick={Report_Issue}>Report Issue</button>
                    </div>
                    <div className="box shadow-2xl">
                        <div className="heading">
                            View All Queries
                        </div>
                        <div className="image">
                            <img src={TrackComplaint} alt="Complaint Register" />
                        </div>
                        <button className='button' onClick={View_Status}>View Complaints</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentHome;