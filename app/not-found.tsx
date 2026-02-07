import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-zinc-400 mb-8">Page not found</p>
        <Link 
          href="/"
          className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
