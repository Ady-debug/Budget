import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between px-4 py-2">
      <div className="text-xl font-extrabold text-gray-900 dark:text-white">
        &#128176; Budget
      </div>
      <div className="text-l text-gray-900 dark:text-white">Login &#8658;</div>
    </header>
  );
}

// TODO: Setup login route for authorisation
