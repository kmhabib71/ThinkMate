export default function HomeLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-white dark:bg-gray-900 rounded-full"></div>
          </div>
        </div>
        <h2 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          ThinkMate
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Loading your AI-powered experience...
        </p>
      </div>
    </div>
  );
}
