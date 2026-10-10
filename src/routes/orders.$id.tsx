import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileDown, PackageSearch, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import {
  EmptyState,
  PageHeader,
  ProgressBar,
  StatusBadge,
} from "@/components/kit/primitives";
import { ProductionTimeline, StageDot } from "@/components/kit/production";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getOrder, type StageRecord } from "@/lib/data";

export const Route = createFileRoute("/orders/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.id} — TexMind` },
      {
        name: "description",
        content: `Production command centre for order ${params.id}: stage timeline, output and delivery status.`,
      },
      { property: "og:title", content: `Order ${params.id} — TexMind` },
      { property: "og:description", content: "Nine-stage garment production tracking for this order." },
    ],
  }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = Route.useParams();
  const order = getOrder(id);
  const [selected, setSelected] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  if (!order) {
    return (
      <AppShell>
        <EmptyState
          icon={PackageSearch}
          title="Order not found"
          body={`No order matches “${id}”. It may have been archived or the link is incorrect.`}
          action={
            <Button asChild size="sm">
              <Link to="/orders">Back to orders</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const current: StageRecord =
    order.stages.find((s) => s.key === (selected ?? order.currentStage)) ?? order.stages[0]!;

  return (
    <AppShell>
      <Link
        to="/orders"
        className="mb-3 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> All orders
      </Link>

      <PageHeader
        title={`Order #${order.id}`}
        subtitle={`${order.product} · ${order.styleNo} · ${order.poNo}`}
        actions={
          <>
            <StatusBadge>{order.status}</StatusBadge>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setSyncing(true);
                setTimeout(() => {
                  setSyncing(false);
                  toast.success("Production data refreshed", {
                    description: `${order.id} synced with the shop floor.`,
                  });
                }, 900);
              }}
            >
              <RefreshCw className={cn("size-3.5", syncing && "animate-spin")} /> Sync
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => toast.success("Order sheet exported")}>
              <FileDown className="size-3.5" /> Export
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Buyer", order.buyer],
          ["Quantity", `${order.quantity.toLocaleString()} pieces`],
          ["Delivery", order.deliveryDate],
          ["Priority", order.priority],
        ].map(([k, v]) => (
          <div key={k} className="surface p-4">
            <div className="text-[11.5px] uppercase tracking-wide text-muted-foreground">{k}</div>
            <div className="mt-1.5 text-[15px] font-semibold">{v}</div>
          </div>
        ))}
        <div className="surface p-4">
          <div className="text-[11.5px] uppercase tracking-wide text-muted-foreground">Progress</div>
          <div className="metric mt-1.5 text-[15px] font-semibold">{order.progress}%</div>
          <ProgressBar
            value={order.progress}
            tone={order.status === "Delayed" ? "danger" : "primary"}
            className="mt-2"
          />
        </div>
      </div>

      <div className="surface mt-5 p-5">
        <h2 className="text-[15px] font-semibold">Production Timeline</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Nine-stage journey from yarn to packing. Select a stage to inspect it.
        </p>
        <div className="mt-6 overflow-x-auto pb-1">
          <div className="min-w-[720px]">
            <ProductionTimeline stages={order.stages} />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
          {order.stages.map((s) => (
            <button
              key={s.key}
              onClick={() => setSelected(s.key)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-[12.5px] font-medium transition-colors",
                current.key === s.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <StageDot state={s.state} size="sm" /> {s.label}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="stage" className="mt-5">
        <TabsList>
          <TabsTrigger value="stage">Stage details</TabsTrigger>
          <TabsTrigger value="specs">Order specification</TabsTrigger>
          <TabsTrigger value="stages">All stages</TabsTrigger>
        </TabsList>

        <TabsContent value="stage" className="mt-4">
          <div className="surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-semibold">Current Stage: {current.label}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Manager {current.manager} · Expected completion {current.expected}
                </p>
              </div>
              <StatusBadge>
                {current.state === "completed"
                  ? "Completed"
                  : current.state === "delayed"
                    ? "Delayed"
                    : current.state === "current"
                      ? "In Production"
                      : "Pending"}
              </StatusBadge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
              {[
                ["Target", current.target.toLocaleString()],
                ["Completed", current.completed.toLocaleString()],
                ["Pending", current.pending.toLocaleString()],
                ["Rejected", current.rejected.toLocaleString()],
                ["Completion", `${current.progress}%`],
                ["Production rate", `${current.rate.toLocaleString()} /day`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="text-[11px] text-muted-foreground">{k}</div>
                  <div className="metric mt-1 text-[15px] font-semibold">{v}</div>
                </div>
              ))}
            </div>
            <ProgressBar
              value={current.progress}
              tone={current.state === "delayed" ? "danger" : current.progress === 100 ? "success" : "primary"}
              className="mt-4"
            />
          </div>
        </TabsContent>

        <TabsContent value="specs" className="mt-4">
          <div className="surface p-5">
            <dl className="grid gap-y-3 sm:grid-cols-2">
              {[
                ["Buyer", order.buyer],
                ["Category", order.category],
                ["Fabric", order.fabric],
                ["Colour", order.color],
                ["Style number", order.styleNo],
                ["PO number", order.poNo],
                ["Production start", order.startDate],
                ["Expected delivery", order.deliveryDate],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-border/60 pb-2 text-[13px]">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="stages" className="mt-4">
          <div className="surface overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  {["Stage", "Status", "Target", "Completed", "Pending", "Rejected", "Progress", "Manager"].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.stages.map((s) => (
                  <tr key={s.key} className="border-t border-border/70">
                    <td className="px-4 py-3 font-medium">{s.label}</td>
                    <td className="px-4 py-3">
                      <StatusBadge>
                        {s.state === "completed"
                          ? "Completed"
                          : s.state === "delayed"
                            ? "Delayed"
                            : s.state === "current"
                              ? "In Production"
                              : "Pending"}
                      </StatusBadge>
                    </td>
                    <td className="metric px-4 py-3">{s.target.toLocaleString()}</td>
                    <td className="metric px-4 py-3">{s.completed.toLocaleString()}</td>
                    <td className="metric px-4 py-3">{s.pending.toLocaleString()}</td>
                    <td className="metric px-4 py-3">{s.rejected.toLocaleString()}</td>
                    <td className="metric px-4 py-3">{s.progress}%</td>
                    <td className="px-4 py-3">{s.manager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
