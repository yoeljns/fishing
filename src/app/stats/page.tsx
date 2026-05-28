import { getStats } from "@/lib/catches";
import { StatsView } from "@/components/StatsView";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const stats = await getStats();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Stats</h1>
      <StatsView stats={stats} />
    </div>
  );
}
