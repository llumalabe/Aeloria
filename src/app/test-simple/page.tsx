// Simple test page - NO Wagmi, NO Web3
// This should work even if Wagmi is broken

export default function TestPage() {
  return (
    <div className="min-h-screen bg-purple-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">โœ… Test Page Works!</h1>
      <p className="text-xl mb-4">If you see this, Next.js is working.</p>
      
      <div className="bg-black/50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">System Check:</h2>
        <ul className="space-y-2">
          <li>โœ… Next.js: Working</li>
          <li>โœ… React: Working</li>
          <li>โœ… Tailwind: Working</li>
          <li>โœ… Routing: Working</li>
        </ul>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-400">
          Test URL: /test-simple
        </p>
        <p className="text-sm text-gray-400">
          If this page loads but homepage doesn't, the problem is in Web3/Wagmi setup.
        </p>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        console.log('โœ… Test page JavaScript executed');
        console.log('Window object exists:', typeof window !== 'undefined');
        console.log('Document object exists:', typeof document !== 'undefined');
      `}} />
    </div>
  );
}
