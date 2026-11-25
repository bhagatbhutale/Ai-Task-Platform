import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#0b1120] flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Navbar />

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
