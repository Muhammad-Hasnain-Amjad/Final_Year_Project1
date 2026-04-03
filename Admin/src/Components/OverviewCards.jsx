import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Users, Clock, AlertCircle, CheckCircle, TrendingUp, Activity } from "lucide-react";

function StatCard({ title, value, icon, trend, color, delay }) {
  const IconComponent = icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 shadow-xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-transparent rounded-full blur-2xl"></div>
        </div>
        
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10`}>
            <IconComponent className="w-6 h-6 text-yellow-400" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">{trend}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <p className="text-3xl font-bold text-white">
          <CountUp start={0} end={value} duration={2} separator="," />
        </p>
        
        {/* Animated Border Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </motion.div>
  );
}

export default function OverviewCards() {
  const stats = [
    { title: "Total Users", value: 2345, icon: Users, color: "from-blue-500 to-blue-600", trend: "+12%", delay: 0 },
    { title: "Pending Doctors", value: 12, icon: Clock, color: "from-orange-500 to-orange-600", trend: "+2", delay: 0.1 },
    { title: "Pending Lawyers", value: 8, icon: AlertCircle, color: "from-yellow-500 to-yellow-600", trend: "+3", delay: 0.2 },
    { title: "Approved Total", value: 220, icon: CheckCircle, color: "from-green-500 to-green-600", trend: "+18%", delay: 0.3 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}