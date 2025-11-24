import React from "react";

export default function Input(props) {
  return (
    <label className="font-normal text-sm text-gray-700 dark:text-gray-400 flex gap-5 mb-1">
      <span className="w-40">{props.title}:</span>
      <div className="before:content-['£']">
        <input
          className="w-18 border rounded-lg border-transparent group-hover:border-indigo-500 transition-colors duration-100"
          name={props.name}
          type="text"
          placeholder=" per month"
          onChange={props.onChange}
          value={props.value}
        ></input>
      </div>
    </label>
  );
}
