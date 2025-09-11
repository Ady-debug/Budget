import React from "react";

const date = new Date();
const year = date.getFullYear();

export default function () {
  return (
    <footer className="flex justify-center-safe">
      <div className="text-sm p-2 text-gray-900 dark:text-white">
        Adrian Soltan, ©{year}
      </div>
    </footer>
  );
}

// TODO: Improve info on footer and review styling
