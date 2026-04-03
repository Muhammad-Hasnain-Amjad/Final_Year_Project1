import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { 
  Activity, 
  Shield, 
  Users, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Zap,
  Server,
  Database,
  Globe
} from "lucide-react";

const HealthMetric = ({ title, value, suffix, icon: Icon, color, status, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-5 border border-gray-800 overflow-hidden">
        {/* Status Indicator */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            status === 'healthy' ? 'bg-green-500/20 text-green-400' :
            status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              status === 'healthy' ? 'bg-green-400 animate-pulse' :
              status === 'warning' ? 'bg-yellow-400' :
              'bg-red-400'
            }`}></div>
            <span>{status === 'healthy' ? 'Operational' : status === 'warning' ? 'Degraded' : 'Critical'}</span>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10`}>
            <Icon className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-white">
                <CountUp start={0} end={value} duration={2} separator="," />
              </p>
              {suffix && <span className="text-gray-400 text-sm">{suffix}</span>}
            </div>
          </div>
        </div>

        {/* Progress Bar Animation */}
        <div className="mt-4">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(value, 100)}%` }}
              transition={{ delay: delay + 0.3, duration: 1 }}
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SystemMetric = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center justify-between p-3 rounded-xl bg-gray-900/50 border border-gray-800"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color} bg-opacity-10`}>
          <Icon className="w-4 h-4 text-yellow-400" />
        </div>
        <span className="text-gray-300 text-sm">{title}</span>
      </div>
      <span className="text-white font-semibold">{value}</span>
    </motion.div>
  );
};

export default function SystemHealth() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { title: "Uptime", value: 99.9, suffix: "%", icon: Activity, color: "from-green-500 to-green-600", status: "healthy", delay: 0 },
    { title: "API Response Time", value: 124, suffix: "ms", icon: Zap, color: "from-blue-500 to-blue-600", status: "healthy", delay: 0.1 },
    { title: "Active Sessions", value: 342, suffix: "", icon: Users, color: "from-purple-500 to-purple-600", status: "healthy", delay: 0.2 },
    { title: "Pending Approvals", value: 20, suffix: "", icon: Clock, color: "from-yellow-500 to-yellow-600", status: "warning", delay: 0.3 },
  ];

  const systemMetrics = [
    { title: "Database Connections", value: "24/50", icon: Database, color: "from-cyan-500 to-cyan-600" },
    { title: "Cache Hit Rate", value: "87%", icon: Server, color: "from-indigo-500 to-indigo-600" },
    { title: "API Requests (24h)", value: "12.4K", icon: Globe, color: "from-teal-500 to-teal-600" },
    { title: "Error Rate", value: "0.3%", icon: AlertTriangle, color: "from-red-500 to-red-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-transparent px-6 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-xl">
              <Activity className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">System Health Dashboard</h2>
              <p className="text-gray-400 text-sm">Real-time monitoring & analytics</p>
            </div>
          </div>
          
          {/* Live Time Indicator */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg border border-gray-800">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Live Updates</span>
            <span className="text-sm text-yellow-400 font-mono">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => (
            <HealthMetric key={index} {...stat} />
          ))}
        </div>

        {/* System Metrics Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">System Resources</h3>
            <span className="text-xs text-gray-500">Last updated: 2 seconds ago</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {systemMetrics.map((metric, index) => (
              <SystemMetric key={index} {...metric} />
            ))}
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">All systems operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">SSL Certificate Valid</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-20 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-xs text-gray-500">System Load: 75%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}