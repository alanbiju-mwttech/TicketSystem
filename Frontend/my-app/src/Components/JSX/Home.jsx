import NavBar from "./NavBar";
import AdminHome from "./AdminHome";
import StudentHome from "./StudentHome";
import OtherRolesHome from "./OtherRoleHome";

const Home = () => {
    const role = sessionStorage.getItem("role");

    const renderHomeByRole = () => {
        switch (role) {
            case "Student":
                return <StudentHome />;

            case "Admin":
                return <AdminHome />;

            default:
                return <OtherRolesHome />;
        }
    };

    return (
        <>
            <NavBar />
            <div className="home mt-20">
                {renderHomeByRole()}
            </div>
        </>
    );
};

export default Home;