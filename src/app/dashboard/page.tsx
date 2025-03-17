import { KanbanBoard } from "~/app/_components/KanbanBoard";
import { Navbar } from "~/app/_components/Navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-4">
        <KanbanBoard />
      </main>
    </div>
  );
}
