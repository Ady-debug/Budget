import "./App.css";
import Income from "./components/Income";

function App() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-violet-200 dark:from-slate-700 dark:to-violet-900 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-6xl mx-auto">
        <Income />
      </div>
    </div>
  );
}

export default App;
