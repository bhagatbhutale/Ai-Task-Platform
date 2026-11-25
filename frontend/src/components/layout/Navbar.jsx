import { Bell, UserCircle } from "lucide-react";
import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-[#111827] border-b border-gray-800 flex items-center justify-between px-8">
      <div>
        <h2 className="text-white text-xl font-semibold">Dashboard</h2>
        <p className="text-gray-500 text-sm">
          Manage and monitor your AI tasks
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-gray-400 hover:text-white">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <UserCircle size={32} className="text-orange-400" />

          <div>
            <p className="text-white text-sm font-medium">
              {user?.name || "User"}
            </p>
            <p className="text-gray-500 text-xs">{user?.email || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
