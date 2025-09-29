"use client";
import { useState, useRef, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRouter } from "next/navigation";

import "primeicons/primeicons.css";
import { useSession } from "next-auth/react";

export default function App() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session);
    setTimeout(() => {
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/login");
      }
    }, 5000);
  });
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen w-full">
        <ProgressSpinner
          style={{ width: "96px", height: "96px" }}
          strokeWidth="4"
          fill="var(--surface-ground)"
          animationDuration="1s"
        />
      </div>
    </>
  );
}
