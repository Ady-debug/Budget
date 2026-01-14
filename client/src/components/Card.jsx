import React from "react";

export default function Card(props) {
  const { title, error, children } = props;

  return (
    <form className="flex flex-col h-full p-6 bg-white/20 border border-white/30 rounded-lg shadow-sm dark:bg-white/10 dark:border-white/20 backdrop-blur-sm group hover:shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300">
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h2>
      {error && (
        <p className="font-bold text-xs text-red-400">{error.message}</p>
      )}
      <div className="flex-1">{children}</div>
    </form>
  );
}
