import { UserX } from "lucide-react";

export default function EmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">

      {/* ICON WITH GLOW */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-30 animate-pulse"></div>

        <UserX
          size={90}
          className="relative text-yellow-400 animate-bounce"
        />
      </div>

      {/* TEXT */}
      <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
        {title}
      </h2>

      <p className="text-gray-400 max-w-md">
        {subtitle}
      </p>
    </div>
  );
}
