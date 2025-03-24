import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <h2 className="text-2xl mt-4 font-semibold">Page Not Found</h2>
      <p className="text-gray-600 mt-2">The page you are looking for doesn’t exist.</p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
