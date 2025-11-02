export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-6xl font-bold text-yellow-400 mb-4">404</h1>
            <p className="text-2xl text-gray-300 mb-8">Page Not Found</p>
            <a 
              href="/" 
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-bold transition-colors"
            >
              Return to Town
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
