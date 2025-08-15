"use client";

import { projectObj } from "@/lib/ProjDetails";
import Link from "next/link";
import { MdOnlinePrediction } from "react-icons/md";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [stats, setStats] = useState<string[]>(projectObj.map(() => "Checking"));

  // Function to check website status via API route
  const checkWebsiteStatus = async (url: string) => {
    try {
      await fetch(`${encodeURIComponent(url)}`);
      return "Online";
    } catch (error) {
      console.error(error)
      return "Offline";
    }
  };

  // Function to update statuses for all projects
  const updateStatuses = async () => {
    const newStats = await Promise.all(
      projectObj.map(async (proj) => {
        const status = await checkWebsiteStatus(proj.link);
        return status;
      })
    );
    setStats(newStats);
  };

  // Run status check on mount and every 1 minute
  useEffect(() => {
    updateStatuses(); // Initial check on component mount

    const interval = setInterval(() => {
      updateStatuses();
    }, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col h-screen container mx-auto">
      <Link href="/" className="px-20 py-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl border-4 w-fit mx-auto p-1 lg:p-2 rounded rounded-br-xl border-primary text-primary font-bold">
          SUPXDEVS
        </h1>
      </Link>

      <div className="flex flex-col gap-2 p-2 sm:px-20 sm:py-8">
        <div className="hidden lg:flex flex-grow text-center">
          <div className="w-[10%] text-lg font-semibold">Name</div>
          <div className="w-[25%] text-lg font-semibold">Link</div>
          <div className="w-[10%] text-lg font-semibold">Status</div>
          <div className="w-[15%] text-lg font-semibold">Last Updated</div>
          <div className="w-[40%] text-lg font-semibold">Description</div>
        </div>

        <div className="flex flex-col sm:gap-2 text-sm lg:text-lg px-2 sm:px-0">
          {projectObj.map((proj, indx) => (
            <div
              key={proj.name}
              className="flex flex-col flex-grow gap-1 sm:flex-row text-center items-center border rounded shadow-lg lg:divide-x"
            >
              <div className="sm:w-[10%] p-1 sm:p-2 text-lg">{proj.name}</div>
              <Link
                target="_blank"
                href={proj.link}
                className="sm:w-[25%] p-1 sm:p-2 hover:text-primary/80 hover:scale-105"
                title={`visit ${proj.link}`}
              >
                {proj.link}
              </Link>
              <div
                className={`sm:w-[10%] ${
                  stats[indx] === "Online" ? "text-green-300" : "text-red-300"
                } flex items-center justify-center gap-1 p-1 sm:p-2`}
              >
                <span className="animate-pulse duration-200 transition-all">
                  <MdOnlinePrediction />
                </span>
                {stats[indx] || "Unknown"}
              </div>
              <div className="sm:w-[15%] p-1 sm:p-2">{proj.lastUpdate}</div>
              <div className="sm:w-[40%] p-1 sm:p-2">{proj.description}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
