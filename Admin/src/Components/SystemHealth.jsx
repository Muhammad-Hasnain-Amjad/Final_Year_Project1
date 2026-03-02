import React from "react";
import CountUp from "react-countup";

export default function SystemHealth() {
  // Example numbers, replace with real API data
  const stats = [
    { title: "Upload Success Rate", value: 98, suffix: "%" },
    { title: "Approval Turnaround Time", value: 3, suffix: " hrs" },
    { title: "New Users Today", value: 24 },
  ];

  return (
    <div className="bg-black border border-yellow-400 rounded-2xl p-6 text-white shadow-lg mt-6">
      <h2 className="text-yellow-400 font-semibold text-2xl mb-4">
        📈 System Health
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-black/40 rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_20px_100px_rgba(250,204,21,0.1)]"
          >
            <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-yellow-400">
              <CountUp
                start={0}
                end={stat.value}
                duration={1.5}
                separator=","
              />
              {stat.suffix || ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
