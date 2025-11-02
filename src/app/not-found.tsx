'use client';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-purple-300 mb-4">404</h1>
        <h2 className="text-3xl font-cinzel font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist in the realm of Aeloria.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          Return to Town
        </a>
      </div>
    </div>
  );
}
