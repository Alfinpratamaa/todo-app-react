import useSWR from "swr";
import {
  getChecklists,
  createChecklist,
  deleteChecklist,
  type Checklist,
  type ApiResponse,
} from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function DashboardPage() {
  const { data, error, mutate } = useSWR<ApiResponse<Checklist[]>>(
    "/checklist",
    async () => {
      const res = await getChecklists();
      return (
        res ?? {
          statusCode: 500,
          message: "No data",
          errorMessage: null,
          data: [],
        }
      );
    }
  );

  console.log("DashboardPage data:", data, "error:", error);
  const [newChecklistName, setNewChecklistName] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleCreate = async () => {
    try {
      await createChecklist({ name: newChecklistName });
      mutate();
      toast.success("Checklist berhasil dibuat!");
      setNewChecklistName("");
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Gagal membuat checklist, silakan coba lagi"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteChecklist(id);
      mutate();
      toast.success("Checklist berhasil dihapus!");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus checklist, silakan coba lagi"
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (error) return <div>Gagal memuat data...</div>;
  if (!data) return <div>Memuat...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard Checklist</h1>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Buat Checklist Baru</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Checklist Baru</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Nama Checklist..."
                value={newChecklistName}
                onChange={(e) => setNewChecklistName(e.target.value)}
              />
              <Button onClick={handleCreate}>Simpan</Button>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleLogout} className="ml-2">
            Logout
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data?.data.map((checklist: Checklist) => (
          <Card key={checklist.id}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{checklist.name}</CardTitle>
              {/* Badge status */}
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  checklist.checklistCompletionStatus
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {checklist.checklistCompletionStatus
                  ? "Complete"
                  : "Incomplete"}
              </span>
            </CardHeader>
            <CardContent>
              <p>Daftar Item:</p>
              <ul className="list-disc ml-4">
                {checklist.items?.map((item) => (
                  <li
                    key={item.id}
                    className={
                      item.itemCompletionStatus
                        ? "line-through text-gray-500"
                        : ""
                    }
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardContent className="flex justify-between">
              <Link to={`/checklist/${checklist.id}`}>
                <Button variant="outline">Lihat Detail</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
