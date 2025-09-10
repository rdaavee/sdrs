import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import EntryPage from "./pages/EntryPage";
import AddMembers from "./admin/members/pages/AddMembers";
import MyProfile from "./admin/profile/pages/MyProfile";
import MainContent from "./admin/dashboard/pages/MainContent";
import RequestList from "./admin/request/RequestList";
import Index from "./admin";

function App() {
    return (
        <Router>
            <Routes>
                {/* ALLOW ONLY IF USER IS AUTHENTICATED */}
                <Route path="EntryPage" element={<EntryPage />} />
                <Route path="/" element={<Index />}>
                    <Route index element={<MainContent />} />
                    <Route path="pages/MyProfile" element={<MyProfile />} />

                    <Route
                        path="pages/StaffManagement"
                        element={<AddMembers />}
                    />
                    <Route path="pages/RequestList" element={<RequestList />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
