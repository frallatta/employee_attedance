"use client";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import AppTopbar from "@/layout/AppTopbar";
import { AppTopbarRef } from "@/types";

import "primeicons/primeicons.css";

export default function DashboardPage() {
  const [count, setCount] = useState(0);
  const topbarRef = useRef<AppTopbarRef>(null);
  return (
    <>
      <div>
        {/* <p className="mb-10">
          <a href="https://nextjs.org/" target="_blank">
            <img src="/next.svg" className="logo inline-block animate-spin [animation-duration:5s]" alt="Next.JS logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src="/react.svg" className="logo react inline-block" alt="React logo" />
          </a>
        </p>
        <h1>Next.js + PrimeReact + TailwindCSS</h1>
        <div>
          <h2>Demo app showing PrimeReact + Tailwind CSS in unstyled mode</h2>
        </div> */}
        <div className="card">
          <Button
            icon="pi pi-plus"
            className="mr-2"
            label="Increment"
            onClick={() => setCount((count) => count + 1)}
          ></Button>
          <InputText value={count.toString()} />
        </div>
        <p className="read-the-docs">
          Click on the Next and React logos to learn more
        </p>
      </div>
    </>
  );
}
