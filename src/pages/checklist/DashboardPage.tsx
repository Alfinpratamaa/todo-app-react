import useSWR from "swr";
import { getChecklists, type Checklist, type ApiResponse } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const { data, error } = useSWR<ApiResponse<Checklist[]>>(
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

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (error) return <div>Gagal memuat data...</div>;
  if (!data) return <div>Memuat...</div>;

  const completeChecklists = data.data.filter(
    (c) => c.checklistCompletionStatus
  );
  const incompleteChecklists = data.data.filter(
    (c) => !c.checklistCompletionStatus
  );

  const renderChecklistCard = (checklist: Checklist) => (
    <Card key={checklist.id}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{checklist.name}</CardTitle>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            checklist.checklistCompletionStatus
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          {checklist.checklistCompletionStatus ? "Complete" : "Incomplete"}
        </span>
      </CardHeader>
      <CardContent>
        <p>Daftar Item:</p>
        <ul className="list-disc ml-4">
          {checklist.items?.map((item) => (
            <li
              key={item.id}
              className={
                item.itemCompletionStatus ? "line-through text-gray-500" : ""
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
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard Checklist</h1>
        <div>
          <Button onClick={() => navigate("/checklist/create")}>
            Buat Checklist Baru
          </Button>
          <Button variant="outline" onClick={handleLogout} className="ml-2">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-600">
            Complete
          </h2>
          <div className="space-y-4">
            {completeChecklists.map(renderChecklistCard)}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Incomplete
          </h2>
          <div className="space-y-4">
            {incompleteChecklists.map(renderChecklistCard)}
          </div>
        </div>
      </div>
    </div>
  );
}
