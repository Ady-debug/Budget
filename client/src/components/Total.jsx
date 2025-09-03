import React from "react";

export default function Total(props) {
  return (
    <p className="font-normal text-gray-700 dark:text-gray-400">
      {props.total > 0 && `Total: £${props.total}`}
    </p>
  );
}
