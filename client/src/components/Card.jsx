export default function Card(props) {
  const { title, error, children } = props;

  return (
    <form className="flex flex-col h-full p-6 bg-white/60 dark:bg-white/10 border border-gray-200/60 dark:border-white/40 rounded-lg shadow-xl backdrop-blur-xl backdrop-saturate-150 group hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h2>
      {error && (
        <p className="font-bold text-xs text-red-400">{error.message}</p>
      )}
      <div className="flex-1">{children}</div>
    </form>
  );
}
