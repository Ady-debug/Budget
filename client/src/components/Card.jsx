import React from "react";

export default function Card(title) {
  return (
    <form className="block max-w-sm p-6 bg-white/20 border border-white/30 rounded-lg shadow-sm dark:bg-white/10 dark:border-white/20 backdrop-blur-sm">
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h2>
    </form>
  );
}

// TODO: Build out Card component and integrate with Input component and relevant props to allow for easy re-usability and only have to change styling in one place
