"use client";
import { useState, useRef, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { redirect, useRouter } from "next/navigation";

import "primeicons/primeicons.css";
import { signOut, useSession } from "next-auth/react";

export default function App() {
  const { data: session } = useSession();
  console.log(session);
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await signOut({
        redirect: false,
      });
      redirect("/auth/login");
    };
    logout();
  });
  return <></>;
}
