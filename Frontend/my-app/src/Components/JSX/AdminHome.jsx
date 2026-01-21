import '../CSS/StudentHome.css'
import AddWorkFlow from "../../Assets/AddWorkflow.png";
import ViewWorkFlow from "../../Assets/ViewWorkflow.png";
import TrackComplaint from "../../Assets/TrackComplaint.png";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AdminHome = () =>{

    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
            const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
            setIsLoggedIn(loggedIn);
    }, []);

    const AddWorkflow = () => {
        console.log(isLoggedIn)
        isLoggedIn ? navigate('/addWorkFlow') : navigate('/login')
    }

    const ViewWorkFlows = () => {
        console.log(isLoggedIn)
        isLoggedIn ? navigate('/allWorkFlow') : navigate('/login')
    }

    const View_Status = () => {
        isLoggedIn ? navigate('/all-complaint') : navigate('/login')
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
                            Create New WorkFlow
                        </div>
                        <div className="image">
                            <img src={AddWorkFlow} alt="Complaint Register" />
                        </div>
                        <button className='button' onClick={AddWorkflow}>Create WorkFlow</button>
                    </div>
                    <div className="box shadow-2xl">
                        <div className="heading">
                            View Previous Workflows
                        </div>
                        <div className="image">
                            <img src={ViewWorkFlow} alt="Complaint Register" />
                        </div>
                        <button className='button' onClick={ViewWorkFlows}>View WorkFlows</button>
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

export default AdminHome;