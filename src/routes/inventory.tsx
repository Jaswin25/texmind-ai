import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, Boxes, Lock, PackageMinus, Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  ChartCard,
  KpiCard,
  PageHeader,
  StatusBadge,
  chartAxis,
  tooltipStyle,
} from "@/components/kit/primitives";
import { Input } from "@/components/ui/input";
import { materials, sparkline } from "@/lib/data";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory Intelligence — TexMind" },
      {
        name: "description",
        content: "Yarn, fabric, chemical and trim inventory with reserved, available and minimum levels.",
      },
      { property: "og:title", content: "Inventory Intelligence — TexMind" },
      { property: "og:description", content: "Track material cover and low-stock risk across the factory." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const [q, setQ] = useState("");
  const rows = materials
    .map((m) => ({
      ...m,
      available: m.stock - m.reserved,
      status: m.stock < m.min ? "Low Stock" : m.stock < m.min * 1.25 ? "Watch" : "Healthy",
    }))
    .filter(
      (m) =>
        !q.trim() ||
        m.name.toLowerCase().includes(q.toLowerCase()) ||
        m.category.toLowerCase().includes(q.toLowerCase()),
    );

  const low = rows.filter((r) => r.status === "Low Stock").length;

  return (
    <AppShell>
      <PageHeader title="Inventory Intelligence" subtitle="Material cover, reservations and consumption risk." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard index={0} label="Total Materials" value={materials.length} hint="Tracked SKUs" trend={2.1} icon={Boxes} spark={sparkline(1)} />
        <KpiCard index={1} label="Low Stock" value={low} hint="Below minimum level" trend={-1.4} icon={AlertTriangle} spark={sparkline(3, false)} />
        <KpiCard index={2} label="Reserved" value="66,780" hint="Allocated to live orders" trend={6.8} icon={Lock} spark={sparkline(5)} />
        <KpiCard index={3} label="Consumed" value="41,320" hint="Used in last 30 days" trend={4.2} icon={PackageMinus} spark={sparkline(7)} />
      </div>

      <div className="mt-5">
        <ChartCard title="Stock vs Minimum Level" subtitle="Current stock against minimum required" height={300}>
          <BarChart data={rows.slice(0, 8)} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" {...chartAxis} tick={{ fontSize: 10 }} interval={0} angle={-14} height={54} textAnchor="end" />
            <YAxis {...chartAxis} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="stock" name="Current stock" radius={[6, 6, 0, 0]} barSize={16}>
              {rows.slice(0, 8).map((r, i) => (
                <Cell key={i} fill={r.status === "Low Stock" ? "var(--color-chart-5)" : "var(--color-chart-1)"} />
              ))}
            </Bar>
            <Bar dataKey="min" name="Minimum level" fill="var(--color-chart-4)" radius={[6, 6, 0, 0]} barSize={16} />
          </BarChart>
        </ChartCard>
      </div>

      <div className="surface mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <h3 className="text-[15px] font-semibold">Materials</h3>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search material or category…"
              className="h-9 pl-9 text-[13px]"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                {["Material", "Category", "Current Stock", "Reserved", "Available", "Minimum Level", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.name} className="border-t border-border/70 hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.category}</td>
                  <td className="metric px-4 py-3">
                    {m.stock.toLocaleString()} {m.unit}
                  </td>
                  <td className="metric px-4 py-3">
                    {m.reserved.toLocaleString()} {m.unit}
                  </td>
                  <td className="metric px-4 py-3">
                    {m.available.toLocaleString()} {m.unit}
                  </td>
                  <td className="metric px-4 py-3">
                    {m.min.toLocaleString()} {m.unit}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={m.status === "Low Stock" ? "danger" : m.status === "Watch" ? "warning" : "success"}>
                      {m.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
