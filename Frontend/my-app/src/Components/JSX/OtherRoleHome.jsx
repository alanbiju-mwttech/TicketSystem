import '../CSS/StudentHome.css'
import RviewComplaint from "../../Assets/RviewComplaint.png";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const OtherRolesHome = () =>{

    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
            const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
            setIsLoggedIn(loggedIn);
    }, []);

    const Review_Complaint = () => {
        isLoggedIn ? navigate('/review-complaint') : navigate('/login')
    }

    return(
        <>
            <div className="main">
                <h2 className="text-4xl font-bold text-center text-gray-600 mt-5">
                    Welcome to Complaint Register Portal.
                </h2>
                <div className='box-grp'>
                    <div className="box shadow-2xl">
                        <div className="heading">
                            Review Complaints
                        </div>
                        <div className="image">
                            <img src={RviewComplaint} alt="Complaint Register" />
                        </div>
                        <button className='button' onClick={Review_Complaint}>Review Complaints</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OtherRolesHome;