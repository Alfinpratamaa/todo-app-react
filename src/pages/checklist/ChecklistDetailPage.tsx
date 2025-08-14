import { useParams, Link } from "react-router-dom";
import useSWR from "swr";
import { useState } from "react";
import {
  getChecklistItems,
  createChecklistItem,
  deleteChecklistItem,
  updateItemStatus,
  renameItem,
  type ChecklistItem,
} from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [editingName, setEditingName] = useState("");

  if (error) return <div>Gagal memuat item...</div>;
  if (!data) return <div>Memuat...</div>;

  const handleCreateItem = async () => {
    if (!newItemName.trim()) {
      toast.error("Nama item tidak boleh kosong");
      return;
    }
    try {
      await createChecklistItem(checklistId!, { itemName: newItemName });
      mutate();
      setNewItemName("");
      setAddDialogOpen(false); // tutup dialog
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

  const handleRenameItem = async () => {
    if (!editingName.trim() || !editingItem) return;

    try {
      await renameItem(checklistId!, editingItem.id, { itemName: editingName });
      mutate();
      setEditDialogOpen(false);
      setEditingItem(null);
      setEditingName("");
      toast.success("Nama item berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Gagal memperbarui nama item"
      );
    }
  };

  const handleToggleStatus = async (itemId: string) => {
    try {
      await updateItemStatus(checklistId!, itemId);
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

      {/* Tombol Tambah Item */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Tambah Item</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Item Baru</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Nama item baru..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <Button className="mt-2" onClick={handleCreateItem}>
            Simpan
          </Button>
        </DialogContent>
      </Dialog>

      {/* Dialog Rename */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Nama Item</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Nama baru"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
          />
          <Button className="mt-2" onClick={handleRenameItem}>
            Simpan
          </Button>
        </DialogContent>
      </Dialog>

      {/* Daftar Item */}
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
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingItem(item);
                    setEditingName(item.name);
                    setEditDialogOpen(true);
                  }}
                >
                  Ubah Nama
                </Button>
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
