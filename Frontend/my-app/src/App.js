import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ComplaintRegister from './Components/JSX/ComplaintRegister';
import Home from './Components/JSX/Home';
import Login from './Components/JSX/Login';
import AddWorkFlow from './Components/JSX/AddWorkFlow';
import AllWorkFlow from './Components/JSX/AllWorkFlows';
import ViewStatus from './Components/JSX/ViewStatus';
import ReviewComplaint from './Components/JSX/ReviewComplaint';
import ComplaintAction from './Components/JSX/ComplaintAction';
import StudentComplaintDetails from './Components/JSX/StudentComplaintDetails';

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/register-complaint' element={<ComplaintRegister />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/addWorkFlow' element={<AddWorkFlow />} />
                    <Route path='/allWorkFlow' element={<AllWorkFlow />} />
                    <Route path='/view-status' element={<ViewStatus />} />
                    <Route path='/review-complaint' element={<ReviewComplaint />} />
                    <Route path='/complaints/:complaint_id/act' element={<ComplaintAction />} />
                    <Route path='/complaints/:complaint_id/view' element={<StudentComplaintDetails />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;