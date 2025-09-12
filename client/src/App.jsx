import "./App.css";
import Income from "./components/Income";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeExpense from "./components/HomeExpense";

function App() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 via-violet-200 to-teal-100 dark:from-slate-700 dark:via-indigo-900 dark:to-violet-900 min-h-screen">
      <Header />
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-6xl mx-auto">
        <Income />
        <HomeExpense />
      </div>
      <Footer />
    </div>
  );
}

export default App;
