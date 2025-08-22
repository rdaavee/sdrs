import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import EntryPage from "./pages/EntryPage";
import Dashboard from "./admin/Dashboard";
import MainContent from "./admin/components/dashboard/MainContent";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />}>
                    <Route index element={<MainContent />} />

                    <Route
                        path="pages/AddAdmin"
                        element={<div>Add Admin Page</div>}
                    />
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
