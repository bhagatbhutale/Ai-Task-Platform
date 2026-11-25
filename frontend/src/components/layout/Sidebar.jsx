import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  LogOut,
  Cpu,
} from "lucide-react";

import { useAuth } from "../../context/authContext";

const Sidebar = () => {
  const { logout } = useAuth();

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "All Tasks",
      path: "/tasks",
      icon: ListTodo,
    },
    {
      name: "Create Task",
      path: "/create-task",
      icon: PlusCircle,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#111827] border-r border-gray-800 flex flex-col p-5">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-orange-500 p-2 rounded-lg">
          <Cpu size={22} className="text-white" />
        </div>

        <div>
          <h1 className="text-white font-bold text-lg">AI Task Platform</h1>
          <p className="text-gray-500 text-xs">Task Processing System</p>
        </div>
      </div>

      <p className="text-gray-500 text-xs uppercase mb-4">Workspace</p>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
