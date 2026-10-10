import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Factory,
  HeartPulse,
  Timer,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  ChartCard,
  KpiCard,
  PageHeader,
  ProgressBar,
  RadialScore,
  StatusBadge,
  chartAxis,
  tooltipStyle,
} from "@/components/kit/primitives";
import {
  AIInsightCard,
  BottleneckCard,
  LiveOrderRow,
  ProductionStageCard,
} from "@/components/kit/production";
import { AssignOrderCard } from "@/components/kit/assign-order";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  bottlenecks,
  healthBreakdown,
  insights,
  orderStatusSplit,
  orders,
  productionTrend,
  sparkline,
  stagePerformance,
  stageSummaries,
  targetVsActual,
  totals,
} from "@/lib/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Factory Dashboard — TexMind" },
      {
        name: "description",
        content:
          "Live garment factory overview: 9-stage production flow, KPIs, bottlenecks and AI insights.",
      },
      { property: "og:title", content: "Factory Dashboard — TexMind" },
      {
        property: "og:description",
        content: "Monitor every active garment order across all nine production stages.",
      },
    ],
  }),
  component: DashboardPage,
});

const RANGES = ["Today", "Last 7 Days", "Last 30 Days"] as const;

function DashboardPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("Last 7 Days");
  const activeOrders = orders.filter((o) => o.status !== "Completed").slice(0, 6);

  return (
    <AppShell>
      <PageHeader
        title="Good morning, Factory Manager"
        subtitle="Here's your factory production overview."
        actions={
          <div className="flex rounded-lg border border-border bg-card p-0.5">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                  range === r
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard index={0} label="Total Orders" value={totals.orders} hint="Active production orders" trend={12.5} icon={ClipboardList} spark={sparkline(1)} />
        <KpiCard index={1} label="In Production" value={totals.inProduction} hint="Currently running" trend={8.2} icon={Factory} spark={sparkline(3)} />
        <KpiCard index={2} label="Completed" value={totals.completed} hint="Orders completed" trend={15.4} icon={CheckCircle2} spark={sparkline(5)} />
        <KpiCard index={3} label="Delayed" value={totals.delayed} hint="Require attention" trend={-4.5} icon={AlertTriangle} spark={sparkline(7, false)} />
        <KpiCard index={4} label="On-Time Rate" value={`${totals.onTimeRate}%`} hint="Delivery performance" trend={3.2} icon={Timer} spark={sparkline(2)} />
        <KpiCard index={5} label="Production Quantity" value={totals.producedQty.toLocaleString()} unit="pieces" hint="Current output" trend={9.8} icon={Activity} spark={sparkline(4)} />
        <KpiCard index={6} label="Pending Quantity" value={totals.pendingQty.toLocaleString()} unit="pieces" hint="Remaining production" trend={-2.4} icon={Clock} spark={sparkline(6, false)} />
        <KpiCard index={7} label="Factory Health" value={`${totals.health}/100`} hint="Overall factory score" badge="Healthy" icon={HeartPulse} spark={sparkline(8)} />
      </div>

      {/* Factory health + production trend */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="surface p-5">
          <h3 className="text-[15px] font-semibold">Factory Health</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Composite score across five signals.</p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <RadialScore score={totals.health} />
            <div className="w-full space-y-2.5">
              <StatusBadge tone="success">Healthy</StatusBadge>
              {healthBreakdown.map((h) => (
                <div key={h.label}>
                  <div className="flex items-baseline justify-between text-[12.5px]">
                    <span className="text-muted-foreground">{h.label}</span>
                    <span className="metric font-semibold">{h.value}%</span>
                  </div>
                  <ProgressBar
                    value={h.value}
                    tone={h.value >= 90 ? "success" : h.value >= 85 ? "primary" : "warning"}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <ChartCard
          title="Production Trend"
          subtitle={`Daily output in pieces · ${range}`}
          className="lg:col-span-2"
          height={300}
        >
          <AreaChart data={productionTrend}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="day" {...chartAxis} />
            <YAxis {...chartAxis} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="output" name="Output" stroke="var(--color-chart-1)" strokeWidth={2.4} fill="url(#trendFill)" />
            <Line type="monotone" dataKey="target" name="Target" stroke="var(--color-chart-4)" strokeDasharray="5 4" dot={false} />
          </AreaChart>
        </ChartCard>
      </div>

      {/* Order assignment */}
      <section className="mt-7">
        <AssignOrderCard />
      </section>

      {/* Live production flow */}
      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Live Production Flow</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Monitor every active order across the factory.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/production">Open production</Link>
          </Button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {stageSummaries.map((s) => (
            <ProductionStageCard key={s.key} stage={s} />
          ))}
        </div>

        <div className="surface mt-4 p-4">
          <h3 className="mb-3 text-[15px] font-semibold">Live Order Flow</h3>
          <div className="grid gap-3 xl:grid-cols-2">
            {activeOrders.map((o) => (
              <LiveOrderRow key={o.id} order={o} />
            ))}
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="mt-7">
        <h2 className="mb-3 text-lg font-semibold">Production Analytics</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Target vs Actual" subtitle="Weekly production in pieces">
            <BarChart data={targetVsActual} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" {...chartAxis} />
              <YAxis {...chartAxis} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="target" name="Target" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} barSize={18} />
              <Bar dataKey="actual" name="Actual" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} barSize={18} />
            </BarChart>
          </ChartCard>

          <ChartCard title="Stage Performance" subtitle="Completion percentage by stage" height={280}>
            <BarChart data={stagePerformance} layout="vertical" barSize={13}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} unit="%" {...chartAxis} />
              <YAxis type="category" dataKey="name" width={86} {...chartAxis} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" name="Completion" radius={[0, 6, 6, 0]}>
                {stagePerformance.map((s, i) => (
                  <Cell
                    key={i}
                    fill={s.value >= 80 ? "var(--color-chart-3)" : s.value >= 55 ? "var(--color-chart-1)" : "var(--color-chart-4)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartCard>

          <ChartCard title="Order Status" subtitle="Distribution across 15 orders">
            <PieChart>
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Pie
                data={orderStatusSplit}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
                stroke="none"
              >
                {orderStatusSplit.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartCard>

          <BottleneckCard items={bottlenecks} />
        </div>
      </section>

      {/* AI intelligence */}
      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">TexMind Intelligence</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              AI-powered insights from your factory data.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/ai-intelligence">Intelligence centre</Link>
          </Button>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {insights.slice(0, 3).map((i) => (
            <AIInsightCard key={i.id} insight={i} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
