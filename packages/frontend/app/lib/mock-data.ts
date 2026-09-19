export type MockUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER";
  walletBalance: number;
  suspended: boolean;
};

export type MockBundle = {
  id: string;
  network: "MTN" | "Telecel" | "AirtelTigo";
  size: string;
  validity: string;
  price: string;
  popular: boolean;
  active: boolean;
};

export type MockOrder = {
  id: string;
  reference: string;
  network: string;
  bundleSize: string;
  validity: string;
  recipientPhone: string;
  amount: string;
  paymentStatus: "PENDING_PAYMENT" | "PAID" | "FAILED";
  deliveryStatus: "PENDING" | "PROCESSING" | "DELIVERED" | "FAILED";
  createdAt: string;
  paymentMethod: string;
  userId?: string | null;
  guest?: boolean;
};

export const MOCK_USER: MockUser = {
  id: "mock-user-001",
  name: "Kyrios Mensah",
  email: "kyrios@example.com",
  phone: "+233244000000",
  role: "USER",
  walletBalance: 35.5,
  suspended: false,
};

export const MOCK_BUNDLES: MockBundle[] = [
  { id: "bundle-mtn-1", network: "MTN", size: "1GB", validity: "1 Day", price: "GH₵ 2.00", popular: false, active: true },
  { id: "bundle-mtn-2", network: "MTN", size: "5GB", validity: "7 Days", price: "GH₵ 12.00", popular: true, active: true },
  { id: "bundle-mtn-3", network: "MTN", size: "10GB", validity: "30 Days", price: "GH₵ 20.00", popular: true, active: true },
  { id: "bundle-telecel-1", network: "Telecel", size: "2GB", validity: "7 Days", price: "GH₵ 6.00", popular: false, active: true },
  { id: "bundle-telecel-2", network: "Telecel", size: "6GB", validity: "30 Days", price: "GH₵ 15.00", popular: true, active: true },
  { id: "bundle-airtel-1", network: "AirtelTigo", size: "1GB", validity: "1 Day", price: "GH₵ 3.00", popular: false, active: true },
  { id: "bundle-airtel-2", network: "AirtelTigo", size: "3GB", validity: "7 Days", price: "GH₵ 9.00", popular: true, active: true },
  { id: "bundle-airtel-3", network: "AirtelTigo", size: "8GB", validity: "30 Days", price: "GH₵ 18.00", popular: false, active: true },
];

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "mock-order-1",
    reference: "TXN-20250815-102457",
    network: "MTN",
    bundleSize: "10GB",
    validity: "30 Days",
    recipientPhone: "+233244000001",
    amount: "GH₵ 20.00",
    paymentStatus: "PAID",
    deliveryStatus: "DELIVERED",
    createdAt: "2025-08-15T10:24:57.000Z",
    paymentMethod: "Mobile Money",
    userId: MOCK_USER.id,
    guest: false,
  },
  {
    id: "mock-order-2",
    reference: "TXN-20250820-204820",
    network: "Telecel",
    bundleSize: "6GB",
    validity: "30 Days",
    recipientPhone: "+233244000002",
    amount: "GH₵ 15.00",
    paymentStatus: "PAID",
    deliveryStatus: "PROCESSING",
    createdAt: "2025-08-20T20:48:20.000Z",
    paymentMethod: "Wallet Balance",
    userId: MOCK_USER.id,
    guest: false,
  },
  {
    id: "mock-order-3",
    reference: "TXN-20250905-090505",
    network: "AirtelTigo",
    bundleSize: "3GB",
    validity: "7 Days",
    recipientPhone: "+233244000003",
    amount: "GH₵ 9.00",
    paymentStatus: "PENDING_PAYMENT",
    deliveryStatus: "PENDING",
    createdAt: "2025-09-05T09:05:05.000Z",
    paymentMethod: "Debit / Credit Card",
    userId: MOCK_USER.id,
    guest: false,
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notification-1",
    title: "Data bundle delivered",
    message: "Your MTN 10GB bundle has been delivered successfully.",
    createdAt: "2025-08-15T10:40:00.000Z",
    unread: false,
    tone: "green",
    kind: "order",
  },
  {
    id: "notification-2",
    title: "Wallet balance update",
    message: "Your wallet balance has been refreshed for the latest purchase activity.",
    createdAt: "2025-08-20T20:50:00.000Z",
    unread: true,
    tone: "blue",
    kind: "order",
  },
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: "announcement-1",
    title: "Weekend data offer",
    content: "Enjoy a limited-time bonus on selected 30-day bundles this weekend.",
    category: "Promotions",
    priority: "MEDIUM",
    audience: "Customers",
    published: true,
    createdAt: "2025-08-25T09:00:00.000Z",
  },
  {
    id: "announcement-2",
    title: "Platform maintenance",
    content: "Planned maintenance may temporarily affect some checkout flows on Saturday morning.",
    category: "Maintenance",
    priority: "HIGH",
    audience: "All users",
    published: true,
    createdAt: "2025-08-28T12:00:00.000Z",
  },
];

export function getMockOrdersForUser(userId?: string | null): MockOrder[] {
  const targetUserId = userId ?? MOCK_USER.id;
  return MOCK_ORDERS.filter((order) => !order.userId || order.userId === targetUserId);
}

export function getMockWalletSummary() {
  const total = MOCK_ORDERS.reduce((sum, order) => sum + Number(order.amount.replace(/[^0-9.]/g, "") || 0), 0);
  return {
    balance: "GH₵ 35.50",
    spentThisMonth: `GH₵ ${total.toFixed(2)}`,
    activity: getMockOrdersForUser().slice(0, 5),
  };
}

export function getMockSupportMessages() {
  return [
    { id: "support-1", userId: MOCK_USER.id, message: "I still need help checking my bundle status.", createdAt: "2025-08-22T11:00:00.000Z" },
  ];
}

export function getMockBundleCatalog() {
  return MOCK_BUNDLES;
}

export function getMockOrderByReference(reference: string) {
  return MOCK_ORDERS.find((order) => order.reference === reference) ?? null;
}

export function getMockOrderById(orderId: string) {
  return MOCK_ORDERS.find((order) => order.id === orderId) ?? null;
}

export function createMockOrder(input: Partial<MockOrder> & { reference?: string }) {
  const reference = input.reference ?? `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const order: MockOrder = {
    id: input.id ?? `mock-order-${Date.now()}`,
    reference,
    network: input.network ?? "MTN",
    bundleSize: input.bundleSize ?? "10GB",
    validity: input.validity ?? "30 Days",
    recipientPhone: input.recipientPhone ?? "+233244000000",
    amount: input.amount ?? "GH₵ 20.00",
    paymentStatus: input.paymentStatus ?? "PENDING_PAYMENT",
    deliveryStatus: input.deliveryStatus ?? "PENDING",
    createdAt: input.createdAt ?? new Date().toISOString(),
    paymentMethod: input.paymentMethod ?? "Mobile Money",
    userId: input.userId ?? MOCK_USER.id,
    guest: input.guest ?? false,
  };
  MOCK_ORDERS.unshift(order);
  return order;
}

export function updateMockOrderStatus(orderIdentifier: string, status: Partial<Pick<MockOrder, "paymentStatus" | "deliveryStatus">>) {
  const target = MOCK_ORDERS.find((order) => order.id === orderIdentifier || order.reference === orderIdentifier);
  if (!target) return null;
  if (status.paymentStatus) target.paymentStatus = status.paymentStatus;
  if (status.deliveryStatus) target.deliveryStatus = status.deliveryStatus;
  return target;
}
