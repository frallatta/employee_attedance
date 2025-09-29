import React from "react";
import axiosServer from "@/lib/axiosServer";

import "primeicons/primeicons.css";
import { SWRConfig } from "swr";
import { Profile } from "@/types/profile";
import { format } from "date-fns";
import DashboardTemplate from "./Dashboard";

const ProfilePage = async () => {
  const resProfileData = await axiosServer.get("/auth/profile");
  const profileData: Profile = resProfileData.data;

  const currentDate = format(new Date(), "yyyy-MM-dd");
  const resAttendanceData = await axiosServer.get("/attendances/", {
    params: {
      employeeId: profileData.id,
      attendanceDate: `${currentDate}|${currentDate}`,
    },
  });
  const attendanceData = resAttendanceData.data;
  return (
    <SWRConfig
      value={{
        fallback: { "/attendance": attendanceData },
      }}
    >
      <DashboardTemplate profileData={profileData} />
    </SWRConfig>
  );
};

export default ProfilePage;
