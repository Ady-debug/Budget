import React from "react";

export default function Input(props) {
  return (
    <label className="font-normal text-gray-700 dark:text-gray-400 flex gap-5">
      <span className="w-25">{props.title}:</span>
      <input
        className="w-30"
        name={props.name}
        type="number"
        inputMode="decimal"
        placeholder="£ per month"
        onChange={props.onChange}
        value={props.value}
      ></input>
    </label>
  );
}
