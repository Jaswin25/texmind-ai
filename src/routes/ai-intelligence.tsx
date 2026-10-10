import { createFileRoute } from "@tanstack/react-router";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import {
  PageHeader,
  ProgressBar,
  RadialScore,
  StatusBadge,
} from "@/components/kit/primitives";
import { AIInsightCard } from "@/components/kit/production";
import { healthBreakdown, insights, totals } from "@/lib/data";
import { useMounted } from "@/lib/theme";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ai-intelligence")({
  head: () => ({
    meta: [
      { title: "TexMind Intelligence Centre — AI Factory Insights" },
      {
        name: "description",
        content: "AI risk scoring and recommendations for production, delivery, inventory and quality.",
      },
      { property: "og:title", content: "TexMind Intelligence Centre" },
      { property: "og:description", content: "AI-generated factory risks and recommended actions." },
    ],
  }),
  component: AiIntelligencePage,
});

const risks = [
  { label: "Production Risk", score: 34, tone: "warning", note: "Sewing capacity gap of 800 pcs/day" },
  { label: "Delivery Risk", score: 41, tone: "warning", note: "2 orders trending past committed dates" },
  { label: "Inventory Risk", score: 52, tone: "danger", note: "Cotton yarn cover under 7 days" },
  { label: "Quality Risk", score: 22, tone: "success", note: "Rejection stable at 1.6% factory-wide" },
  { label: "Bottleneck Risk", score: 68, tone: "danger", note: "Sewing holds 18,450 pcs pending" },
];

function AiIntelligencePage() {
  const mounted = useMounted();
  return (
    <AppShell>
      <PageHeader
        title="TexMind Intelligence Centre"
        subtitle="AI-powered insights from your factory data."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface flex flex-col items-center p-5 text-center">
          <h3 className="self-start text-[15px] font-semibold">Factory Health</h3>
          <RadialScore score={totals.health} size={190} />
          <StatusBadge tone="success" className="mt-2">
            Healthy
          </StatusBadge>
          <div className="mt-4 w-full space-y-2.5 text-left">
            {healthBreakdown.map((h) => (
              <div key={h.label}>
                <div className="flex justify-between text-[12.5px]">
                  <span className="text-muted-foreground">{h.label}</span>
                  <span className="metric font-semibold">{h.value}%</span>
                </div>
                <ProgressBar value={h.value} tone={h.value >= 90 ? "success" : "primary"} className="mt-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-5 lg:col-span-2">
          <h3 className="text-[15px] font-semibold">Risk Radar</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Higher values mean greater risk exposure right now.
          </p>
          <div className="mt-3 h-[220px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={risks} outerRadius="78%">
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                  <Radar
                    dataKey="score"
                    stroke="var(--color-chart-1)"
                    fill="var(--color-chart-1)"
                    fillOpacity={0.28}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {risks.map((r) => (
              <div key={r.label} className="rounded-xl border border-border p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold">{r.label}</span>
                  <StatusBadge tone={r.tone as never} dot={false}>
                    {r.score >= 60 ? "HIGH" : r.score >= 35 ? "MEDIUM" : "LOW"}
                  </StatusBadge>
                </div>
                <div className="metric mt-2 text-lg font-semibold">{r.score}</div>
                <ProgressBar
                  value={r.score}
                  tone={r.score >= 60 ? "danger" : r.score >= 35 ? "warning" : "success"}
                  className="mt-2"
                />
                <p className="mt-2 text-[11.5px] text-muted-foreground">{r.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="mb-3 mt-7 text-lg font-semibold">AI Recommendations</h2>
      <div className="grid gap-3 lg:grid-cols-3">
        {insights.map((i) => (
          <AIInsightCard key={i.id} insight={i} detailed />
        ))}
      </div>
    </AppShell>
  );
}
