export type NotificationTone = "green" | "blue" | "amber" | "slate";
export type NotificationKind = "system" | "purchase" | "account" | "order";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  unread: boolean;
  kind: NotificationKind;
  tone: NotificationTone;
  dedupeKey?: string;
};

const STORAGE_KEY = "cellulite_notifications_v1";

function normalizeNotification(item: Partial<NotificationItem>): NotificationItem {
  return {
    id: item.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: item.title ?? "System update",
    message: item.message ?? "",
    createdAt: item.createdAt ?? new Date().toISOString(),
    unread: item.unread ?? true,
    kind: item.kind ?? "system",
    tone: item.tone ?? "blue",
    dedupeKey: item.dedupeKey,
  };
}

export function getStoredNotifications(): NotificationItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => normalizeNotification(item)).slice(0, 100);
  } catch {
    return [];
  }
}

export function writeStoredNotifications(notifications: NotificationItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, 100)));
}

export function addStoredNotification(
  input: {
    title: string;
    message: string;
    kind?: NotificationKind;
    tone?: NotificationTone;
    dedupeKey?: string;
  },
) {
  if (typeof window === "undefined") {
    return null;
  }

  const current = getStoredNotifications();

  if (input.dedupeKey) {
    const existing = current.find((item) => item.dedupeKey === input.dedupeKey);
    if (existing) {
      return existing;
    }
  }

  const notification: NotificationItem = normalizeNotification({
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: input.title,
    message: input.message,
    createdAt: new Date().toISOString(),
    unread: true,
    kind: input.kind ?? "system",
    tone: input.tone ?? "blue",
    dedupeKey: input.dedupeKey,
  });

  const next = [notification, ...current].slice(0, 100);
  writeStoredNotifications(next);
  notifyNotificationsUpdated();

  return notification;
}

export function markAllNotificationsAsRead() {
  const next = getStoredNotifications().map((notification) => ({
    ...notification,
    unread: false,
  }));

  writeStoredNotifications(next);
  notifyNotificationsUpdated();
  return next;
}

export function notifyNotificationsUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event("cellulite-notifications-updated"));
}
