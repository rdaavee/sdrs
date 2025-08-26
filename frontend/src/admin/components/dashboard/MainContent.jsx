import StatsCards from "./StatsCard";
import RequestDocuments from "./RequestDocuments";
import PendingRequests from "./PendingRequests";
import userIcon from "../../../assets/svgs/usericon.svg";
import file from "../../../assets/svgs/file.svg";

const MainContent = () => {
    const stats = [
        { value: "10", label: "Requests", icon: userIcon },
        { value: "10", label: "Pending", icon: userIcon },
        { value: "10", label: "Processing", icon: userIcon },
        { value: "10", label: "Ready", icon: userIcon },
    ];

    const pendingRequests = [
        { icon: file, title: "Transcript", student_id: "03-2223-044501" },
        { icon: file, title: "Transcript", student_id: "03-2223-044501" },
        { icon: file, title: "Transcript", student_id: "03-2223-044501" },
        { icon: file, title: "Transcript", student_id: "03-2223-044501" },
        { icon: file, title: "Transcript", student_id: "03-2223-044501" },
    ];

    return (
        <div>
            <h1 className="text-3xl font-[500] text-[#244034] py-2">
                Dashboard
            </h1>

            <StatsCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-6 gap-10 pt-10">
                <RequestDocuments />

                <PendingRequests requests={pendingRequests} />
            </div>
        </div>
    );
};

export default MainContent;
