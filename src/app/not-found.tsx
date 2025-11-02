// NOT using 'use client' - this is a server component to avoid Wagmi issues
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found | Aeloria</title>
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
            background: linear-gradient(to bottom right, #581c87, #1e3a8a, #312e81);
          }
          .content {
            text-align: center;
            padding: 1rem;
            color: white;
          }
          h1 {
            font-size: 6rem;
            font-weight: bold;
            color: #d8b4fe;
            margin-bottom: 1rem;
          }
          h2 {
            font-size: 1.875rem;
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
          a {
            display: inline-block;
            padding: 0.75rem 2rem;
            background-color: #9333ea;
            color: white;
            font-weight: 600;
            border-radius: 0.5rem;
            text-decoration: none;
            transition: background-color 0.2s;
          }
          a:hover {
            background-color: #7e22ce;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="content">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you are looking for does not exist in the realm of Aeloria.</p>
            <a href="/">Return to Town</a>
          </div>
        </div>
      </body>
    </html>
  );
}
