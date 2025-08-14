import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChecklist } from "@/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreateChecklistPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Nama checklist tidak boleh kosong");
      return;
    }

    try {
      await createChecklist({ name });
      toast.success("Checklist berhasil dibuat!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Gagal membuat checklist"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Buat Checklist Baru
        </h1>
        <Input
          placeholder="Nama Checklist"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
        />
        <div className="flex flex-col justify-center items-center space-y-2">
          <Button onClick={handleCreate} className="w-full ">
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full "
          >
            Batal
          </Button>
        </div>
      </div>
    </div>
  );
}
