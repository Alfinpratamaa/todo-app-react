import { useParams, Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  getChecklistItems,
  updateItemStatus,
  deleteChecklistItem,
  type ChecklistItem,
} from "@/api";

export default function ChecklistDetailPage() {
  const { checklistId } = useParams();
  const navigate = useNavigate();

  const { data, error, mutate } = useSWR(
    `/checklist/${checklistId}/item`,
    async () => {
      const items = await getChecklistItems(checklistId!);
      return items ?? { statusCode: 500, message: "No data", data: [] };
    }
  );
  console.log("Checklist items data:", data);

  if (error) return <div>Gagal memuat item...</div>;
  if (!data) return <div>Memuat...</div>;

  const handleToggleStatus = async (itemId: string) => {
    try {
      await updateItemStatus(checklistId!, itemId);
      mutate();
      toast.success("Status item berhasil diperbarui");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui status item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteChecklistItem(checklistId!, itemId);
      mutate();
      toast.success("Item berhasil dihapus");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus item");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <Link to="/">
          <Button variant="outline">Kembali ke Dashboard</Button>
        </Link>
        <Button onClick={() => navigate(`/checklist/${checklistId}/item/new`)}>
          Tambah Item
        </Button>
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
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(`/checklist/${checklistId}/item/${item.id}/edit`)
                  }
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
