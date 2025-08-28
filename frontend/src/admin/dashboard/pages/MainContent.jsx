import file from "../../../assets/svgs/file.svg";
import StatsCards from "../components/StatsCard";
import RequestDocuments from "../components/RequestDocuments";
import PendingRequests from "../components/PendingRequests";

const MainContent = () => {
    // const pendingRequests = [
    //     { icon: file, title: "Transcript", student_id: "03-2223-044501" },
    //     { icon: file, title: "Transcript", student_id: "03-2223-044501" },
    //     { icon: file, title: "Transcript", student_id: "03-2223-044501" },
    //     { icon: file, title: "Transcript", student_id: "03-2223-044501" },
    //     { icon: file, title: "Transcript", student_id: "03-2223-044501" },
    // ];

    return (
        <div>
            <h1 className="text-3xl font-[500] text-[#244034] py-2">
                Dashboard
            </h1>

            <StatsCards />

            <div className="w-full mt-5">
                <RequestDocuments />

                {/* <PendingRequests requests={pendingRequests} /> */}
            </div>
        </div>
    );
};

export default MainContent;
