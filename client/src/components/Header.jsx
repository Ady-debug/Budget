import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between px-4 py-2 bg-violet-100 dark:bg-indigo-800">
      <div className="text-xl font-extrabold text-gray-900 dark:text-white">
        &#128176; Budget
      </div>
      <div className="text-l text-gray-900 dark:text-white">Login &#8658;</div>
    </header>
  );
}

// TODO: Finalise styling for header
// TODO: Setup login route for authorisation
