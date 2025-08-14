import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createChecklistItem,
  getChecklistItems,
  renameItem,
  type ChecklistItem,
} from "../../api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";

export default function ItemCreatePage() {
  const { checklistId, itemId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const itemIdNum = itemId ? Number(itemId) : undefined;
  const isEdit = Boolean(itemIdNum);

  useEffect(() => {
    const fetchItem = async () => {
      if (!checklistId || !itemIdNum) return;

      try {
        const res = await getChecklistItems(checklistId);
        const item = res?.data.find(
          (i: ChecklistItem) => Number(i.id) === itemIdNum
        );
        setName(item ? item.name : "");
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengambil data item");
      }
    };
    if (isEdit) fetchItem();
  }, [checklistId, isEdit, itemIdNum]);

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      if (isEdit && itemIdNum) {
        await renameItem(checklistId!, itemId!, { itemName: name });
        toast.success("Item berhasil diubah!");
      } else {
        await createChecklistItem(checklistId!, { itemName: name });
        toast.success("Item berhasil dibuat!");
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(isEdit ? "Gagal mengubah item" : "Gagal membuat item");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isEdit ? "Ubah Item" : "Tambah Item"}
        </h1>

        <Input
          placeholder="Nama Item"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
        />
        <div className="flex flex-col justify-center items-center space-y-2">
          <Button onClick={handleSave} className="w-full ">
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            Batal
          </Button>
        </div>
      </div>
    </div>
  );
}
