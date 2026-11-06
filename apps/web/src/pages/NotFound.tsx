import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-midnight p-6 text-center">
      <p className="font-display text-6xl text-gold">404</p>
      <p className="text-ivory/70">This path isn’t part of the heritage trail.</p>
      <Link to="/" className="rounded-full bg-ivory px-5 py-2 text-sm font-semibold text-midnight">
        Back to NAZAR
      </Link>
    </main>
  );
}
