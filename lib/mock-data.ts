export type WorkOrderStatus = "Draft" | "Outreach" | "Hiring" | "Live" | "Completed";

export type WorkOrder = {
  id: string;
  client: string;
  project: string;
  state: string;
  status: WorkOrderStatus;
  startDate: string;
  endDate: string;
  rolesNeeded: { role: string; count: number }[];
  hired: number;
  required: number;
};

export const workOrders: WorkOrder[] = [
  {
    id: "WO101",
    client: "Lendlease Construction",
    project: "Sydney Tower Crane Erection",
    state: "NSW",
    status: "Live",
    startDate: "2026-05-12",
    endDate: "2026-06-04",
    rolesNeeded: [
      { role: "Crane Operator", count: 2 },
      { role: "Dogman", count: 4 },
    ],
    hired: 6,
    required: 6,
  },
  {
    id: "WO102",
    client: "Multiplex Australia",
    project: "Brisbane Civil — North Quay Phase 2",
    state: "QLD",
    status: "Hiring",
    startDate: "2026-05-18",
    endDate: "2026-07-30",
    rolesNeeded: [
      { role: "Rigger", count: 3 },
      { role: "Scaffolder", count: 5 },
    ],
    hired: 5,
    required: 8,
  },
  {
    id: "WO103",
    client: "CPB Contractors",
    project: "Melbourne Demolition — Docklands",
    state: "VIC",
    status: "Outreach",
    startDate: "2026-06-01",
    endDate: "2026-06-28",
    rolesNeeded: [
      { role: "Dogman", count: 2 },
      { role: "Demolition Labourer", count: 6 },
    ],
    hired: 0,
    required: 8,
  },
  {
    id: "WO104",
    client: "John Holland Rail",
    project: "Perth METRONET — Rail Upgrade",
    state: "WA",
    status: "Outreach",
    startDate: "2026-06-08",
    endDate: "2026-08-22",
    rolesNeeded: [
      { role: "Trade Assistant", count: 8 },
      { role: "Crane Operator", count: 1 },
    ],
    hired: 0,
    required: 9,
  },
  {
    id: "WO105",
    client: "Hutchinson Builders",
    project: "Newcastle Wharf Refurbishment",
    state: "NSW",
    status: "Draft",
    startDate: "2026-07-01",
    endDate: "2026-09-15",
    rolesNeeded: [
      { role: "Rigger", count: 4 },
      { role: "Dogman", count: 2 },
    ],
    hired: 0,
    required: 6,
  },
  {
    id: "WO106",
    client: "Probuild",
    project: "Gold Coast Hotel — Stage 3 Fitout",
    state: "QLD",
    status: "Completed",
    startDate: "2026-02-10",
    endDate: "2026-04-30",
    rolesNeeded: [{ role: "Scaffolder", count: 6 }],
    hired: 6,
    required: 6,
  },
];

export type LicenceStatus = "valid" | "expiring" | "expired";

export type Labourer = {
  id: string;
  name: string;
  state: string;
  skills: string[];
  licences: { name: string; status: LicenceStatus }[];
  rating: number;
  lastContacted: string;
  active: boolean;
};

export const labourers: Labourer[] = [
  {
    id: "L001",
    name: "Tom Smith",
    state: "NSW",
    skills: ["Dogman", "Rigger"],
    licences: [
      { name: "White Card", status: "valid" },
      { name: "HRWL", status: "valid" },
      { name: "Driver's", status: "expiring" },
    ],
    rating: 4.8,
    lastContacted: "2 days ago",
    active: true,
  },
  {
    id: "L002",
    name: "Jess Wright",
    state: "QLD",
    skills: ["Crane Operator"],
    licences: [
      { name: "White Card", status: "valid" },
      { name: "HRWL", status: "valid" },
      { name: "CN", status: "valid" },
    ],
    rating: 4.9,
    lastContacted: "5 days ago",
    active: true,
  },
  {
    id: "L003",
    name: "Marcus Doyle",
    state: "VIC",
    skills: ["Scaffolder", "Dogman"],
    licences: [
      { name: "White Card", status: "valid" },
      { name: "Basic Scaffold", status: "valid" },
    ],
    rating: 4.5,
    lastContacted: "1 week ago",
    active: true,
  },
  {
    id: "L004",
    name: "Sarah Mendez",
    state: "WA",
    skills: ["Trade Assistant"],
    licences: [
      { name: "White Card", status: "valid" },
      { name: "Driver's", status: "valid" },
    ],
    rating: 4.2,
    lastContacted: "3 days ago",
    active: true,
  },
  {
    id: "L005",
    name: "Lachlan Reid",
    state: "NSW",
    skills: ["Rigger", "Dogman"],
    licences: [
      { name: "White Card", status: "valid" },
      { name: "Advanced Rigging", status: "expiring" },
    ],
    rating: 4.6,
    lastContacted: "Today",
    active: true,
  },
  {
    id: "L006",
    name: "Priya Naidoo",
    state: "QLD",
    skills: ["Crane Operator", "Dogman"],
    licences: [
      { name: "White Card", status: "valid" },
      { name: "HRWL", status: "valid" },
      { name: "CN", status: "expired" },
    ],
    rating: 4.7,
    lastContacted: "2 weeks ago",
    active: true,
  },
  {
    id: "L007",
    name: "Daniel O'Connor",
    state: "VIC",
    skills: ["Demolition Labourer"],
    licences: [{ name: "White Card", status: "valid" }],
    rating: 4.0,
    lastContacted: "4 days ago",
    active: true,
  },
  {
    id: "L008",
    name: "Aisha Khan",
    state: "NSW",
    skills: ["Scaffolder"],
    licences: [
      { name: "White Card", status: "valid" },
      { name: "Intermediate Scaffold", status: "valid" },
    ],
    rating: 4.4,
    lastContacted: "Yesterday",
    active: true,
  },
  {
    id: "L009",
    name: "Brett Holloway",
    state: "WA",
    skills: ["Trade Assistant", "Dogman"],
    licences: [
      { name: "White Card", status: "valid" },
      { name: "Driver's", status: "expired" },
    ],
    rating: 3.8,
    lastContacted: "1 month ago",
    active: false,
  },
  {
    id: "L010",
    name: "Nina Patel",
    state: "QLD",
    skills: ["Crane Operator"],
    licences: [
      { name: "White Card", status: "valid" },
      { name: "HRWL", status: "expiring" },
    ],
    rating: 4.6,
    lastContacted: "1 week ago",
    active: true,
  },
];

export type ContractStatus = "Created" | "Sent" | "Signed" | "Rejected";

export type HiringEntry = {
  id: string;
  labourerName: string;
  workOrderId: string;
  workOrderProject: string;
  status: ContractStatus;
  sentDate: string;
  signedDate: string | null;
};

export const hiringEntries: HiringEntry[] = [
  {
    id: "H001",
    labourerName: "Tom Smith",
    workOrderId: "WO101",
    workOrderProject: "Sydney Tower Crane Erection",
    status: "Signed",
    sentDate: "2026-05-04",
    signedDate: "2026-05-05",
  },
  {
    id: "H002",
    labourerName: "Lachlan Reid",
    workOrderId: "WO101",
    workOrderProject: "Sydney Tower Crane Erection",
    status: "Signed",
    sentDate: "2026-05-04",
    signedDate: "2026-05-04",
  },
  {
    id: "H003",
    labourerName: "Jess Wright",
    workOrderId: "WO102",
    workOrderProject: "Brisbane Civil — North Quay Phase 2",
    status: "Sent",
    sentDate: "2026-05-09",
    signedDate: null,
  },
  {
    id: "H004",
    labourerName: "Marcus Doyle",
    workOrderId: "WO102",
    workOrderProject: "Brisbane Civil — North Quay Phase 2",
    status: "Sent",
    sentDate: "2026-05-09",
    signedDate: null,
  },
  {
    id: "H005",
    labourerName: "Aisha Khan",
    workOrderId: "WO102",
    workOrderProject: "Brisbane Civil — North Quay Phase 2",
    status: "Created",
    sentDate: "2026-05-10",
    signedDate: null,
  },
  {
    id: "H006",
    labourerName: "Brett Holloway",
    workOrderId: "WO104",
    workOrderProject: "Perth METRONET — Rail Upgrade",
    status: "Rejected",
    sentDate: "2026-05-02",
    signedDate: null,
  },
  {
    id: "H007",
    labourerName: "Priya Naidoo",
    workOrderId: "WO106",
    workOrderProject: "Gold Coast Hotel — Stage 3 Fitout",
    status: "Signed",
    sentDate: "2026-02-15",
    signedDate: "2026-02-16",
  },
];

export type ActivitySeverity = "error" | "warning" | "info";

export type ActivityEntry = {
  id: string;
  severity: ActivitySeverity;
  timestamp: string;
  source: string;
  message: string;
  entityLinks: { label: string; href: string }[];
  actions: { label: string; primary?: boolean }[];
  resolved: boolean;
};

export const activityEntries: ActivityEntry[] = [
  {
    id: "A001",
    severity: "error",
    timestamp: "12 minutes ago",
    source: "Outreach SMS",
    message:
      "Failed to send outreach SMS to Tom Smith — Twilio reports 'invalid mobile number'. 3rd consecutive failure across WO101 and WO103.",
    entityLinks: [
      { label: "→ Tom Smith", href: "/labourers" },
      { label: "→ WO103", href: "/work-orders" },
    ],
    actions: [
      { label: "Retry", primary: true },
      { label: "Mark labourer Inactive" },
      { label: "Dismiss" },
    ],
    resolved: false,
  },
  {
    id: "A002",
    severity: "warning",
    timestamp: "1 hour ago",
    source: "Adobe Sign Webhook",
    message:
      "Signed-contract event missing for Jess Wright's WO102 contract. Sent 26 hours ago, no callback received.",
    entityLinks: [
      { label: "→ Jess Wright", href: "/labourers" },
      { label: "→ WO102", href: "/work-orders" },
    ],
    actions: [
      { label: "Check status in Adobe Sign", primary: true },
      { label: "Mark resolved" },
    ],
    resolved: false,
  },
  {
    id: "A003",
    severity: "error",
    timestamp: "3 hours ago",
    source: "PDF Renderer",
    message:
      "Licence Profile PDF render failed for Jess Wright — template error: 'CN licence image not found'. Last edit at 14:22.",
    entityLinks: [{ label: "→ Jess Wright", href: "/labourers" }],
    actions: [
      { label: "Retry", primary: true },
      { label: "View template" },
      { label: "Dismiss" },
    ],
    resolved: false,
  },
  {
    id: "A004",
    severity: "info",
    timestamp: "Yesterday, 09:00",
    source: "Scheduled Job",
    message: "T+5 client evaluation email sent for WO101 — Lendlease Construction.",
    entityLinks: [{ label: "→ WO101", href: "/work-orders" }],
    actions: [{ label: "View Work Order" }],
    resolved: true,
  },
];
