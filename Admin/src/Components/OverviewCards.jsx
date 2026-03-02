import React from "react";
import CountUp from "react-countup";

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-black border border-yellow-400 rounded-2xl p-6 shadow-xl text-white flex flex-col items-center justify-center">
      <div className="text-yellow-400 mb-2 text-3xl">{icon}</div>
      <p className="text-sm text-yellow-400">{title}</p>
      <p className="text-2xl font-bold mt-1">
        <CountUp start={0} end={value} duration={1.5} separator="," />
      </p>
      
    </div>
  );
}

export default function OverviewCards() {
  // Example numbers, replace with real API data
  const stats = [
    { title: "Users", value: 2345, icon: "👥" },
    { title: "Pending Doctors", value: 12, icon: "⏳" },
    { title: "Pending Lawyers", value: 8, icon: "⏳" },
    { title: "Approved Total", value: 220, icon: "✅" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
