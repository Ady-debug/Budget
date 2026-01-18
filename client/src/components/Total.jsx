export default function Total(props) {
  return (
    <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-5 mt-5">
      <span className="w-40">{props.total > 0 && "Total:"}</span>
      <span className="w-17">{props.total > 0 && `£${props.total}`}</span>
    </p>
  );
}
