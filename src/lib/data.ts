export const STAGES = [
  "yarn",
  "knitting",
  "dyeing",
  "compacting",
  "cutting",
  "printing",
  "sewing",
  "ironing",
  "packing",
] as const;

export type StageKey = (typeof STAGES)[number];

export const STAGE_LABELS: Record<StageKey, string> = {
  yarn: "Yarn",
  knitting: "Knitting",
  dyeing: "Dyeing",
  compacting: "Compacting",
  cutting: "Cutting",
  printing: "Printing",
  sewing: "Sewing",
  ironing: "Ironing",
  packing: "Packing",
};

export type OrderStatus = "On Track" | "Delayed" | "Completed" | "At Risk";
export type Priority = "High" | "Medium" | "Low";
export type StageState = "completed" | "current" | "pending" | "delayed";

export type StageRecord = {
  key: StageKey;
  label: string;
  state: StageState;
  target: number;
  completed: number;
  pending: number;
  rejected: number;
  progress: number;
  rate: number;
  manager: string;
  expected: string;
};

export type Order = {
  id: string;
  buyerId: string;
  buyer: string;
  product: string;
  category: string;
  styleNo: string;
  poNo: string;
  quantity: number;
  fabric: string;
  color: string;
  startDate: string;
  deliveryDate: string;
  priority: Priority;
  status: OrderStatus;
  currentStage: StageKey;
  progress: number;
  stages: StageRecord[];
};

export type Buyer = {
  id: string;
  name: string;
  company: string;
  country: string;
  contact: string;
  active: number;
  completed: number;
  delayed: number;
  total: number;
  lastOrder: string;
};

const MANAGERS = [
  "Raj Kumar",
  "Selvi Meenakshi",
  "Arun Prakash",
  "Divya Rani",
  "Karthik S",
  "Bhuvana R",
  "Muthu Velan",
  "Lakshmi Priya",
  "Ganesh Iyer",
];

function buildStages(
  quantity: number,
  currentStage: StageKey,
  progress: number,
  delayed: boolean,
): StageRecord[] {
  const currentIndex = STAGES.indexOf(currentStage);
  return STAGES.map((key, i) => {
    const isDone = i < currentIndex || progress === 100;
    const isCurrent = i === currentIndex && progress < 100;
    const stageProgress = isDone ? 100 : isCurrent ? Math.min(99, Math.round(progress)) : 0;
    const completed = Math.round((quantity * stageProgress) / 100);
    const rejected = isDone || isCurrent ? Math.round(quantity * 0.012 * ((i % 3) + 1)) : 0;
    const day = 8 + ((i * 2 + quantity) % 18);
    return {
      key,
      label: STAGE_LABELS[key],
      state: isDone ? "completed" : isCurrent ? (delayed ? "delayed" : "current") : "pending",
      target: quantity,
      completed,
      pending: quantity - completed,
      rejected,
      progress: stageProgress,
      rate: 1800 + ((i * 370 + quantity) % 2200),
      manager: MANAGERS[i]!,
      expected: `${day} Sep 2026`,
    };
  });
}

export const buyers: Buyer[] = [
  {
    id: "BUY-01",
    name: "Anita Sharma",
    company: "ABC Fashion",
    country: "United Kingdom",
    contact: "anita@abcfashion.co.uk",
    active: 3,
    completed: 8,
    delayed: 1,
    total: 12,
    lastOrder: "02 Sep 2026",
  },
  {
    id: "BUY-02",
    name: "Michael Reed",
    company: "Northline Apparel",
    country: "United States",
    contact: "m.reed@northline.com",
    active: 3,
    completed: 5,
    delayed: 0,
    total: 8,
    lastOrder: "28 Aug 2026",
  },
  {
    id: "BUY-03",
    name: "Sofia Almeida",
    company: "Lisboa Knitwear",
    country: "Portugal",
    contact: "sofia@lisboaknit.pt",
    active: 3,
    completed: 4,
    delayed: 1,
    total: 8,
    lastOrder: "30 Aug 2026",
  },
  {
    id: "BUY-04",
    name: "Kenji Watanabe",
    company: "Sakura Basics",
    country: "Japan",
    contact: "kenji@sakurabasics.jp",
    active: 3,
    completed: 6,
    delayed: 0,
    total: 9,
    lastOrder: "05 Sep 2026",
  },
  {
    id: "BUY-05",
    name: "Leon Fischer",
    company: "Berlin Urban Wear",
    country: "Germany",
    contact: "leon@berlinurban.de",
    active: 3,
    completed: 3,
    delayed: 0,
    total: 6,
    lastOrder: "01 Sep 2026",
  },
];

type Seed = {
  n: string;
  buyerIdx: number;
  product: string;
  category: string;
  qty: number;
  stage: StageKey;
  progress: number;
  status: OrderStatus;
  priority: Priority;
  delivery: string;
};

const seeds: Seed[] = [
  { n: "001", buyerIdx: 0, product: "Cotton T-Shirt", category: "Knitwear", qty: 10000, stage: "sewing", progress: 78, status: "On Track", priority: "High", delivery: "20 Sep 2026" },
  { n: "002", buyerIdx: 1, product: "Polo T-Shirt", category: "Knitwear", qty: 6500, stage: "dyeing", progress: 35, status: "On Track", priority: "Medium", delivery: "28 Sep 2026" },
  { n: "003", buyerIdx: 2, product: "Hoodie", category: "Fleece", qty: 4200, stage: "packing", progress: 92, status: "On Track", priority: "High", delivery: "14 Sep 2026" },
  { n: "004", buyerIdx: 3, product: "Track Pant", category: "Bottoms", qty: 8000, stage: "cutting", progress: 50, status: "At Risk", priority: "Medium", delivery: "30 Sep 2026" },
  { n: "005", buyerIdx: 0, product: "Kids T-Shirt", category: "Kidswear", qty: 12000, stage: "packing", progress: 100, status: "Completed", priority: "Low", delivery: "06 Sep 2026" },
  { n: "006", buyerIdx: 4, product: "Casual Shirt", category: "Woven", qty: 5400, stage: "knitting", progress: 42, status: "On Track", priority: "Medium", delivery: "03 Oct 2026" },
  { n: "007", buyerIdx: 1, product: "Cotton T-Shirt", category: "Knitwear", qty: 9000, stage: "printing", progress: 64, status: "On Track", priority: "High", delivery: "22 Sep 2026" },
  { n: "008", buyerIdx: 2, product: "Hoodie", category: "Fleece", qty: 3600, stage: "ironing", progress: 88, status: "On Track", priority: "Medium", delivery: "16 Sep 2026" },
  { n: "009", buyerIdx: 3, product: "Polo T-Shirt", category: "Knitwear", qty: 7200, stage: "compacting", progress: 51, status: "On Track", priority: "Low", delivery: "29 Sep 2026" },
  { n: "010", buyerIdx: 4, product: "Track Pant", category: "Bottoms", qty: 6800, stage: "sewing", progress: 72, status: "On Track", priority: "High", delivery: "19 Sep 2026" },
  { n: "011", buyerIdx: 0, product: "Casual Shirt", category: "Woven", qty: 4800, stage: "dyeing", progress: 24, status: "Delayed", priority: "Medium", delivery: "12 Sep 2026" },
  { n: "012", buyerIdx: 1, product: "Kids T-Shirt", category: "Kidswear", qty: 11000, stage: "packing", progress: 96, status: "On Track", priority: "Medium", delivery: "13 Sep 2026" },
  { n: "013", buyerIdx: 2, product: "Cotton T-Shirt", category: "Knitwear", qty: 9500, stage: "cutting", progress: 47, status: "On Track", priority: "Low", delivery: "02 Oct 2026" },
  { n: "014", buyerIdx: 3, product: "Hoodie", category: "Fleece", qty: 5200, stage: "knitting", progress: 38, status: "On Track", priority: "Medium", delivery: "05 Oct 2026" },
  { n: "015", buyerIdx: 4, product: "Polo T-Shirt", category: "Knitwear", qty: 7500, stage: "sewing", progress: 61, status: "Delayed", priority: "High", delivery: "17 Sep 2026" },
];

const FABRICS = ["Single Jersey 180 GSM", "Pique 220 GSM", "Fleece 320 GSM", "Interlock 200 GSM"];
const COLORS = ["Navy Blue", "Off White", "Charcoal", "Olive", "Maroon"];

export const orders: Order[] = seeds.map((s, i) => {
  const buyer = buyers[s.buyerIdx]!;
  const status = s.progress === 100 ? "Completed" : s.status;
  return {
    id: `ORD-2026-${s.n}`,
    buyerId: buyer.id,
    buyer: buyer.company,
    product: s.product,
    category: s.category,
    styleNo: `STY-${420 + i}`,
    poNo: `PO-${9100 + i * 7}`,
    quantity: s.qty,
    fabric: FABRICS[i % FABRICS.length]!,
    color: COLORS[i % COLORS.length]!,
    startDate: `${1 + (i % 20)} Aug 2026`,
    deliveryDate: s.delivery,
    priority: s.priority,
    status,
    currentStage: s.stage,
    progress: s.progress,
    stages: buildStages(s.qty, s.stage, s.progress, status === "Delayed"),
  };
});

export const getOrder = (id: string) => orders.find((o) => o.id.toLowerCase() === id.toLowerCase());

export const totals = {
  orders: orders.length,
  inProduction: orders.filter((o) => o.status !== "Completed").length,
  completed: orders.filter((o) => o.status === "Completed").length,
  delayed: orders.filter((o) => o.status === "Delayed").length,
  producedQty: 68450,
  pendingQty: 24650,
  onTimeRate: 86,
  health: 87,
};

export const healthBreakdown = [
  { label: "Production", value: 91 },
  { label: "Delivery", value: 84 },
  { label: "Quality", value: 88 },
  { label: "Inventory", value: 82 },
  { label: "Efficiency", value: 90 },
];

export type StageSummary = {
  key: StageKey;
  label: string;
  orders: number;
  completedQty: number;
  pendingQty: number;
  progress: number;
  load: "High Load" | "Balanced" | "Light";
};

export const stageSummaries: StageSummary[] = STAGES.map((key) => {
  const active = orders.filter((o) => o.status !== "Completed");
  const inStage = active.filter((o) => o.currentStage === key);
  const completedQty = active.reduce((sum, o) => {
    const rec = o.stages.find((s) => s.key === key)!;
    return sum + rec.completed;
  }, 0);
  const pendingQty = active.reduce((sum, o) => {
    const rec = o.stages.find((s) => s.key === key)!;
    return sum + rec.pending;
  }, 0);
  const progress = Math.round((completedQty / Math.max(1, completedQty + pendingQty)) * 100);
  return {
    key,
    label: STAGE_LABELS[key],
    orders: inStage.length,
    completedQty,
    pendingQty,
    progress,
    load: inStage.length >= 3 ? "High Load" : inStage.length >= 2 ? "Balanced" : "Light",
  };
});

export const productionTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1} Sep`,
  output: 3900 + Math.round(Math.sin(i / 1.7) * 700) + i * 60,
  target: 4600,
}));

export const targetVsActual = [
  { name: "Wk 1", target: 32000, actual: 30450 },
  { name: "Wk 2", target: 33000, actual: 34120 },
  { name: "Wk 3", target: 34000, actual: 31980 },
  { name: "Wk 4", target: 35000, actual: 35620 },
];

export const stagePerformance = stageSummaries.map((s) => ({
  name: s.label,
  value: Math.max(28, Math.min(98, s.progress + 12)),
}));

export const orderStatusSplit = [
  { name: "Completed", value: 3, color: "var(--color-chart-3)" },
  { name: "In Production", value: 9, color: "var(--color-chart-1)" },
  { name: "Delayed", value: 2, color: "var(--color-chart-5)" },
  { name: "Pending", value: 1, color: "var(--color-chart-4)" },
];

export type Bottleneck = {
  stage: string;
  pending: number;
  capacity: number;
  required: number;
  risk: "HIGH" | "MEDIUM" | "LOW";
};

export const bottlenecks: Bottleneck[] = [
  { stage: "Sewing", pending: 18450, capacity: 2800, required: 3600, risk: "HIGH" },
  { stage: "Cutting", pending: 9200, capacity: 3400, required: 3900, risk: "MEDIUM" },
  { stage: "Dyeing", pending: 5400, capacity: 4200, required: 4300, risk: "LOW" },
  { stage: "Packing", pending: 3100, capacity: 5000, required: 4600, risk: "LOW" },
];

export type Insight = {
  id: string;
  icon: string;
  kind: string;
  title: string;
  body: string;
  action?: string;
  cta: string;
  to: string;
  risk: "HIGH" | "MEDIUM" | "LOW";
  impact: string;
};

export const insights: Insight[] = [
  {
    id: "ins-1",
    icon: "⚠️",
    kind: "Delay Risk",
    title: "Order ORD-2026-015",
    body: "This order is progressing 22% below the planned production rate.",
    action: "Increase sewing capacity or allocate an additional line.",
    cta: "View Order",
    to: "/orders/ORD-2026-015",
    risk: "HIGH",
    impact: "7,500 pcs delivery at risk on 17 Sep",
  },
  {
    id: "ins-2",
    icon: "📦",
    kind: "Inventory Alert",
    title: "Cotton yarn cover falling",
    body: "Cotton yarn stock may fall below the required level within 7 days.",
    action: "Raise a purchase order for 3,200 kg combed cotton.",
    cta: "View Inventory",
    to: "/inventory",
    risk: "MEDIUM",
    impact: "Knitting could idle from 15 Sep",
  },
  {
    id: "ins-3",
    icon: "⚡",
    kind: "Bottleneck Detected",
    title: "Sewing is the highest-load stage",
    body: "Sewing is currently the highest-load production stage with 18,450 pcs pending.",
    action: "Shift Line 3 operators to high-priority styles.",
    cta: "Analyze Stage",
    to: "/production/sewing",
    risk: "HIGH",
    impact: "800 pcs/day capacity gap",
  },
  {
    id: "ins-4",
    icon: "🎯",
    kind: "Quality Signal",
    title: "Dyeing rejection trending up",
    body: "Rejection in dyeing rose from 1.4% to 2.6% over the last 5 days on Machine D2.",
    action: "Schedule a dye-bath recalibration for Machine D2.",
    cta: "Analyze Stage",
    to: "/production/dyeing",
    risk: "MEDIUM",
    impact: "~380 pcs/week rework",
  },
  {
    id: "ins-5",
    icon: "🚚",
    kind: "Delivery Opportunity",
    title: "ORD-2026-012 can ship early",
    body: "Packing is 96% complete and cartons are ready 2 days ahead of plan.",
    action: "Confirm early pickup with Northline Apparel.",
    cta: "View Order",
    to: "/orders/ORD-2026-012",
    risk: "LOW",
    impact: "Frees packing floor space",
  },
  {
    id: "ins-6",
    icon: "📈",
    kind: "Efficiency Gain",
    title: "Knitting utilisation headroom",
    body: "Circular knitting machines are running at 78% utilisation across shifts.",
    action: "Pull forward ORD-2026-014 knitting by one day.",
    cta: "Analyze Stage",
    to: "/production/knitting",
    risk: "LOW",
    impact: "+1,200 pcs/week output",
  },
];

export type Material = {
  name: string;
  category: string;
  stock: number;
  reserved: number;
  min: number;
  unit: string;
};

export const materials: Material[] = [
  { name: "Cotton Yarn 30s Combed", category: "Raw Material", stock: 4500, reserved: 1800, min: 2000, unit: "kg" },
  { name: "Polyester Yarn 150D", category: "Raw Material", stock: 1650, reserved: 900, min: 1800, unit: "kg" },
  { name: "Reactive Dye - Navy", category: "Chemical", stock: 620, reserved: 210, min: 300, unit: "kg" },
  { name: "Single Jersey Fabric", category: "Fabric", stock: 8200, reserved: 5100, min: 3000, unit: "kg" },
  { name: "Fleece Fabric 320 GSM", category: "Fabric", stock: 2100, reserved: 1450, min: 2200, unit: "kg" },
  { name: "Printing Ink - White", category: "Chemical", stock: 340, reserved: 120, min: 150, unit: "kg" },
  { name: "Sewing Thread 40/2", category: "Trims", stock: 12500, reserved: 4200, min: 5000, unit: "cones" },
  { name: "Woven Labels", category: "Trims", stock: 46000, reserved: 21000, min: 20000, unit: "pcs" },
  { name: "Poly Bags 12x16", category: "Packing", stock: 68000, reserved: 30000, min: 25000, unit: "pcs" },
  { name: "Export Cartons", category: "Packing", stock: 1900, reserved: 1200, min: 2000, unit: "pcs" },
];

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  tone: "info" | "success" | "warning" | "danger";
};

export const adminNotifications: Notification[] = [
  { id: "n1", type: "New Order", title: "New order ORD-2026-015 received", body: "Berlin Urban Wear placed an order for 7,500 Polo T-Shirts.", time: "12 min ago", read: false, tone: "info" },
  { id: "n2", type: "Production Delay", title: "ORD-2026-011 delayed in Dyeing", body: "Progress is 22% below plan. Delivery on 12 Sep is at risk.", time: "48 min ago", read: false, tone: "danger" },
  { id: "n3", type: "Bottleneck Detected", title: "Sewing load exceeded capacity", body: "18,450 pcs pending against 2,800 pcs/day capacity.", time: "2 h ago", read: false, tone: "warning" },
  { id: "n4", type: "Stage Completed", title: "Printing completed for ORD-2026-007", body: "9,000 pcs cleared printing with 98.4% quality pass.", time: "5 h ago", read: true, tone: "success" },
  { id: "n5", type: "Inventory Alert", title: "Polyester yarn below minimum", body: "1,650 kg in stock against a 1,800 kg minimum level.", time: "8 h ago", read: true, tone: "warning" },
  { id: "n6", type: "Buyer Update", title: "ABC Fashion requested a shipment update", body: "Anita Sharma asked for revised ETA on ORD-2026-001.", time: "1 d ago", read: true, tone: "info" },
];

export const buyerNotifications: Notification[] = [
  { id: "bn1", type: "Stage Completed", title: "Printing completed", body: "Order ORD-2026-001 has cleared the printing stage.", time: "3 h ago", read: false, tone: "success" },
  { id: "bn2", type: "Production Delay", title: "Production update", body: "Order ORD-2026-011 is currently delayed during dyeing.", time: "6 h ago", read: false, tone: "warning" },
  { id: "bn3", type: "Production Started", title: "Production started", body: "Order ORD-2026-013 has entered cutting.", time: "1 d ago", read: true, tone: "info" },
  { id: "bn4", type: "Packing Completed", title: "Packing completed", body: "Order ORD-2026-005 is packed and awaiting shipment.", time: "2 d ago", read: true, tone: "success" },
  { id: "bn5", type: "Shipment Ready", title: "Shipment ready", body: "Order ORD-2026-005 is ready for pickup on 08 Sep.", time: "2 d ago", read: true, tone: "success" },
  { id: "bn6", type: "Order Received", title: "Order received", body: "We have received your purchase order PO-9107.", time: "5 d ago", read: true, tone: "info" },
];

export const BUYER_ID = "BUY-01";
export const buyerOrders = orders.filter((o) => o.buyerId === BUYER_ID);

export const users = [
  { name: "Factory Manager", email: "manager@texmind.in", role: "Administrator", stage: "All", status: "Active" },
  { name: "Raj Kumar", email: "raj@texmind.in", role: "Process Manager", stage: "Sewing", status: "Active" },
  { name: "Selvi Meenakshi", email: "selvi@texmind.in", role: "Process Manager", stage: "Knitting", status: "Active" },
  { name: "Arun Prakash", email: "arun@texmind.in", role: "Process Manager", stage: "Dyeing", status: "Active" },
  { name: "Divya Rani", email: "divya@texmind.in", role: "Quality Lead", stage: "Cutting", status: "Active" },
  { name: "Muthu Velan", email: "muthu@texmind.in", role: "Process Manager", stage: "Packing", status: "Invited" },
];

export function sparkline(seed: number, trendUp = true) {
  return Array.from({ length: 12 }, (_, i) => ({
    i,
    v:
      40 +
      Math.round(Math.sin((i + seed) / 1.5) * 12) +
      (trendUp ? i * 2.4 : (11 - i) * 1.6),
  }));
}

/* ---------- Units: yarn → compacting are weighed in kg, cutting → packing counted in pieces ---------- */

export const KG_STAGES: StageKey[] = ["yarn", "knitting", "dyeing", "compacting"];
export const PIECE_STAGES: StageKey[] = ["cutting", "printing", "sewing", "ironing", "packing"];

export type StageUnit = "kg" | "pcs";

export function unitFor(stage: StageKey): StageUnit {
  return (KG_STAGES as string[]).includes(stage) ? "kg" : "pcs";
}

/* Average fabric consumption per garment including cutting wastage. */
export const KG_PER_PIECE = 0.24;

export function kgForPieces(pieces: number) {
  return Math.round(pieces * KG_PER_PIECE);
}

/* Quantity a stage should receive, in that stage's own unit. */
export function stageQuantity(stage: StageKey, pieces: number) {
  return unitFor(stage) === "kg" ? kgForPieces(pieces) : pieces;
}

export function formatStageQty(stage: StageKey, value: number) {
  return `${value.toLocaleString()} ${unitFor(stage)}`;
}

export const stageManagers: Record<StageKey, string> = {
  yarn: "Ganesh Iyer",
  knitting: "Selvi Meenakshi",
  dyeing: "Arun Prakash",
  compacting: "Bhuvana R",
  cutting: "Divya Rani",
  printing: "Karthik S",
  sewing: "Raj Kumar",
  ironing: "Lakshmi Priya",
  packing: "Muthu Velan",
};
