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
    <html lang="en">
      <head>
        <title>Error | Aeloria</title>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to bottom right, #7f1d1d, #581c87, #312e81);
          }
          .content {
            text-align: center;
            padding: 1rem;
            color: white;
          }
          h1 {
            font-size: 4rem;
            font-weight: bold;
            color: #fca5a5;
            margin-bottom: 1rem;
          }
          h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          p {
            color: #d1d5db;
            margin-bottom: 2rem;
            max-width: 28rem;
            margin-left: auto;
            margin-right: auto;
          }
          button, a {
            display: inline-block;
            padding: 0.75rem 2rem;
            color: white;
            font-weight: 600;
            border-radius: 0.5rem;
            text-decoration: none;
            transition: background-color 0.2s;
            border: none;
            cursor: pointer;
            margin: 0 0.5rem;
          }
          button {
            background-color: #dc2626;
          }
          button:hover {
            background-color: #b91c1c;
          }
          a {
            background-color: #9333ea;
          }
          a:hover {
            background-color: #7e22ce;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="content">
            <h1>Error</h1>
            <h2>Something went wrong!</h2>
            <p>{error.message || 'An unexpected error occurred in Aeloria.'}</p>
            <div>
              <button onClick={reset}>Try Again</button>
              <a href="/">Return to Town</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
