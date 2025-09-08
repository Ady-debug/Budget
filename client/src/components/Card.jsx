import React from "react";

export default function Card(props) {
  return (
    <form className="block max-w-fit p-6 bg-white/20 border border-white/30 rounded-lg shadow-sm dark:bg-white/10 dark:border-white/20 backdrop-blur-sm">
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {props.title}
      </h2>
      {props.error && (
        <p className="font-bold text-red-400">{props.error.message}</p>
      )}
      {props.children}
    </form>
  );
}
