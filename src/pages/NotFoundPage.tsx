import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Halaman tidak ditemukan</p>
      <Link to="/">
        <Button variant="default">Kembali ke Dashboard</Button>
      </Link>
    </div>
  );
}
