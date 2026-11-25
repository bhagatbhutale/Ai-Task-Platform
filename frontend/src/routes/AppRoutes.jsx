
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import CreateTask from "../pages/CreateTask";
import Tasks from "../pages/Tasks";
import TaskDetails from "../pages/TaskDetails";
import GuestRoute from "../components/common/GusteRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

{/* // Only logged Out User Access this Path  */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

{/* // protected Route */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/tasks" element={<Tasks />} />

          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;








// import { Routes, Route, Navigate } from "react-router-dom";

// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import ProtectedRoute from "../components/common/ProtectedRoute";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/dashboard" replace />} />

//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       <Route element={<ProtectedRoute />}>
//         <Route
//           path="/dashboard"
//           element={<div className="p-8">Dashboard coming in Step 3</div>}
//         />
//       </Route>

//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// };

// export default AppRoutes;
