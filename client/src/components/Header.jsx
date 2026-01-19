export default function Header({ user, onSignOut }) {
  return (
    <header className="flex justify-between px-4 py-2">
      <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
        &#128176; Budget
      </div>
      {user && (
        <div className="flex items-center gap-4">
          {/* Display user's email */}
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Welcome, {user.user_metadata?.name || "User"}
            </span>
          </div>

          {/* Sign out button */}
          <div>
            <button
              onClick={onSignOut}
              className="text-sm bg-white/80 dark:bg-white/20 text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-white/40 hover:bg-white dark:hover:bg-white/30 transition-all duration-200 font-medium shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
