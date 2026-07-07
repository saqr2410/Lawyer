import { apiRequest } from "./api.js";

// ==========================
// CACHE (prevent duplicates)
// ==========================
let shown = new Set(
    JSON.parse(localStorage.getItem("shown_notifications") || "[]")
);

let intervalId = null;

// ==========================
// INIT
// ==========================
export function initDesktopNotifications() {

    // 🔐 IMPORTANT: don't run without login
    const token = localStorage.getItem("access");

    if (!token) {
        console.log("⛔ No access token → skipping desktop notifications");
        return;
    }

    if (!("Notification" in window)) {
        console.warn("Browser does not support notifications");
        return;
    }

    // ask permission once
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }

    // run first time immediately
    check();

    // clear old interval if exists
    if (intervalId) {
        clearInterval(intervalId);
    }

    // polling every 30 sec
    intervalId = setInterval(check, 30000);
}

// ==========================
// CHECK NOTIFICATIONS
// ==========================
async function check() {

    try {

        // 🔐 extra safety (prevents runtime 401 spam)
        const token = localStorage.getItem("access");
        if (!token) return;

        const res = await apiRequest("/notifications/desktop/");

        const notifications = Array.isArray(res?.data)
            ? res.data
            : [];

        for (const notification of notifications) {

            if (!notification?.id) continue;

            // prevent duplicate notifications
            if (shown.has(notification.id)) continue;

            shown.add(notification.id);
            saveCache();

            await showNotification(notification);
        }

    } catch (error) {
        console.log("Desktop notification error:", error);
    }
}

// ==========================
// SHOW NOTIFICATION
// ==========================
async function showNotification(notification) {

    if (Notification.permission !== "granted") {
        return;
    }

    try {

        new Notification(notification.title || "إشعار", {
            body: notification.message || "",
            icon: "/assets/logo.png"
        });

        // mark as sent in backend
        await apiRequest(
            `/notifications/${notification.id}/mark_as_sent/`,
            {
                method: "POST"
            }
        );

    } catch (error) {
        console.log("Show notification error:", error);
    }
}

// ==========================
// SAVE CACHE
// ==========================
function saveCache() {
    localStorage.setItem(
        "shown_notifications",
        JSON.stringify([...shown])
    );
}

// ==========================
// RESET CACHE (optional debug)
// ==========================
export function resetNotificationCache() {
    shown.clear();
    localStorage.removeItem("shown_notifications");
}