import React from "react";
import axiosServer from "@/lib/axiosServer";
import "primeicons/primeicons.css";
import { format } from "date-fns";
import DashboardTemplate from "./DashboardTemplate";

const EmployeePage = async () => {
  const resEmployeeData = await axiosServer.get("/employees/");
  const listEmployeeData = resEmployeeData.data;
  const currentDate = format(new Date(), "yyyy-MM-dd");

  const resAttendanceData = await axiosServer.get("/attendances/", {
    params: {
      attendanceDate: `${currentDate}|${currentDate}`,
    },
  });
  const attendanceData = resAttendanceData.data;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-12">
        <div className="card">
          <h5>Dashboard</h5>
          <DashboardTemplate
            attendanceCount={attendanceData.length}
            employeeCount={listEmployeeData.length}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
