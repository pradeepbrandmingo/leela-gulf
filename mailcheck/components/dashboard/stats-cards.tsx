import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  total: number;
  deliverable: number;
  undeliverable: number;
  unknown: number;
}

export function StatsCards({ total, deliverable, undeliverable, unknown }: StatsCardsProps) {
  const items = [
    { label: "Total Checks", value: total, accent: "text-slate-900" },
    { label: "Deliverable", value: deliverable, accent: "text-emerald-600" },
    { label: "Undeliverable", value: undeliverable, accent: "text-red-600" },
    { label: "Unknown", value: unknown, accent: "text-amber-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="p-5">
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className={cn("mt-2 text-3xl font-semibold tabular-nums", item.accent)}>
            {item.value.toLocaleString()}
          </p>
        </Card>
      ))}
    </div>
  );
}
