import React from "react";

export default function InputLabel(props) {
  return (
    <label className="font-normal text-gray-700 dark:text-gray-400">
      {props.title}:{props.children}
    </label>
  );
}
