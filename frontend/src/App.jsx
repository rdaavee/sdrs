import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import EntryPage from "./pages/EntryPage";
import Dashboard from "./admin/Dashboard";
import AddMembers from "./admin/members/pages/AddMembers";
import MyProfile from "./admin/profile/pages/MyProfile";
import MainContent from "./admin/dashboard/pages/MainContent";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />}>
                    <Route index element={<MainContent />} />
                    <Route path="pages/MyProfile" element={<MyProfile />} />

                    <Route path="pages/AddAdmin" element={<AddMembers />} />
                    <Route
                        path="pages/RequestList"
                        element={<div>Request List Page</div>}
                    />
                    <Route
                        path="pages/SavedAdmins"
                        element={<div>Saved Admins Page</div>}
                    />
                </Route>

                <Route path="/entry-page" element={<EntryPage />} />
            </Routes>
        </Router>
    );
}

export default App;
