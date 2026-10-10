import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  EmptyState,
  PageHeader,
  ProgressBar,
  StatusBadge,
  toneFor,
} from "@/components/kit/primitives";
import { ProductionTimeline } from "@/components/kit/production";
import { Button } from "@/components/ui/button";
import { STAGE_LABELS, buyerOrders } from "@/lib/data";

export const Route = createFileRoute("/buyer/orders/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.id} — TexMind Buyer Portal` },
      { name: "description", content: `Live production tracking for order ${params.id}, stage by stage.` },
      { property: "og:title", content: `Order ${params.id} — TexMind Buyer Portal` },
      { property: "og:description", content: "Follow this order from yarn through packing." },
    ],
  }),
  component: BuyerOrderDetail,
});

function BuyerOrderDetail() {
  const { id } = Route.useParams();
  const order = buyerOrders.find((o) => o.id.toLowerCase() === id.toLowerCase());

  if (!order) {
    return (
      <AppShell variant="buyer">
        <EmptyState
          icon={PackageSearch}
          title="Order not available"
          body="This order isn't part of your account."
          action={
            <Button asChild size="sm">
              <Link to="/buyer/orders">Back to my orders</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const done = order.stages.filter((s) => s.state === "completed").length;

  return (
    <AppShell variant="buyer">
      <Link
        to="/buyer/orders"
        className="mb-3 inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to my orders
      </Link>

      <PageHeader
        title={order.product}
        subtitle={`${order.id} · PO ${order.poNo} · Style ${order.styleNo}`}
        actions={<StatusBadge tone={toneFor(order.status)}>{order.status}</StatusBadge>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface p-5">
          <h3 className="text-[15px] font-semibold">Order summary</h3>
          <dl className="mt-3 space-y-2.5 text-[13px]">
            {[
              ["Quantity", `${order.quantity.toLocaleString()} pcs`],
              ["Fabric", order.fabric],
              ["Colour", order.color],
              ["Start date", order.startDate],
              ["Delivery date", order.deliveryDate],
              ["Current stage", STAGE_LABELS[order.currentStage]],
              ["Stages completed", `${done} of ${order.stages.length}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <div className="flex justify-between text-[12.5px]">
              <span className="text-muted-foreground">Overall progress</span>
              <span className="metric font-semibold">{order.progress}%</span>
            </div>
            <ProgressBar value={order.progress} className="mt-1.5" />
          </div>
        </div>

        <div className="surface p-5 lg:col-span-2">
          <h3 className="text-[15px] font-semibold">Production journey</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Yarn to Packing, updated live by the factory floor.
          </p>
          <div className="mt-4">
            <ProductionTimeline stages={order.stages} />
          </div>
        </div>
      </div>

      <div className="surface mt-4 overflow-hidden">
        <div className="border-b border-border p-4">
          <h3 className="text-[15px] font-semibold">Stage progress</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                {["Stage", "Status", "Completed", "Progress", "Expected"].map((h) => (
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
                    <StatusBadge
                      tone={
                        s.state === "completed"
                          ? "success"
                          : s.state === "current"
                            ? "info"
                            : s.state === "delayed"
                              ? "danger"
                              : "muted"
                      }
                    >
                      {s.state}
                    </StatusBadge>
                  </td>
                  <td className="metric px-4 py-3">
                    {s.completed.toLocaleString()} / {s.target.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={s.progress} className="w-24" />
                      <span className="metric text-[12px]">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.expected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
