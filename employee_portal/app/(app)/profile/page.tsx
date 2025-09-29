import React from "react";
import axiosServer from "@/lib/axiosServer";

import "primeicons/primeicons.css";
import { SWRConfig } from "swr";
import ProfileTemplate from "./Profile";

const ProfilePage = async () => {
  const resProfileData = await axiosServer.get("/auth/profile");
  const profileData = resProfileData.data;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-12">
        <div className="card">
          <h5>Profile</h5>
          <SWRConfig
            value={{
              fallback: { "/profile": profileData },
            }}
          >
            <ProfileTemplate />
          </SWRConfig>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
