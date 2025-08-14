import { useParams, Link } from "react-router-dom";
import useSWR from "swr";
import { useState } from "react";
import {
  getChecklistItems,
  createChecklistItem,
  deleteChecklistItem,
  updateItemStatus,
  type ChecklistItem,
} from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function ChecklistDetailPage() {
  const { checklistId } = useParams();

  const { data, error, mutate } = useSWR(
    `/checklist/${checklistId}/item`,
    async () => {
      const items = await getChecklistItems(checklistId!);
      return (
        items ?? {
          statusCode: 500,
          message: "No data",
          errorMessage: null,
          data: [],
        }
      );
    }
  );

  const [newItemName, setNewItemName] = useState("");

  if (error) return <div>Gagal memuat item...</div>;
  if (!data) return <div>Memuat...</div>;

  const handleCreateItem = async () => {
    if (!newItemName.trim()) {
      toast.error("Nama item tidak boleh kosong");
      return;
    }
    try {
      const res = await createChecklistItem(checklistId!, {
        itemName: newItemName,
      });
      console.log("New item created:", res);

      mutate();
      setNewItemName("");
      toast.success("Item berhasil ditambahkan!");
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Gagal menambahkan item, silakan coba lagi"
      );
    }
  };

  const handleToggleStatus = async (itemId: string) => {
    try {
      const resp = await updateItemStatus(checklistId!, itemId);
      console.log("Item status updated:", resp);
      mutate();
      toast.success("Status item berhasil diperbarui");
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui status item, silakan coba lagi"
      );
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteChecklistItem(checklistId!, itemId);
      mutate();
      toast.success("Item berhasil dihapus");
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Gagal menghapus item, silakan coba lagi"
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Link to="/">
        <Button variant="outline" className="mb-4">
          Kembali ke Dashboard
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">Detail Checklist</h1>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nama item baru..."
          value={newItemName}
          required
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <Button onClick={handleCreateItem}>Tambah Item</Button>
      </div>

      <div className="space-y-2">
        {data.data.map((item: ChecklistItem) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={item.itemCompletionStatus}
                  onCheckedChange={() => handleToggleStatus(item.id)}
                />
                <span
                  className={
                    item.itemCompletionStatus
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
                  {item.name}
                </span>
              </div>
              <div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
