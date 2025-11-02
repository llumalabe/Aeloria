'use client';

export const dynamic = 'force-dynamic';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900">
          <div className="text-center px-4">
            <h1 className="text-6xl font-bold text-red-300 mb-4">Error</h1>
            <h2 className="text-2xl font-cinzel font-bold text-white mb-4">
              Something went wrong!
            </h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              {error.message || 'An unexpected error occurred in Aeloria.'}
            </p>
            <button
              onClick={reset}
              className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors mr-4"
            >
              Try Again
            </button>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Return to Town
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
