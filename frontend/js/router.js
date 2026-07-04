import { renderAccounts } from "../pages/accounts/accounts.js";
import { renderClients } from "../pages/clients/clients.js";
import { renderCases } from "../pages/cases/cases.js";
import { renderDocuments } from "../pages/documents/documents.js";
import { renderHearings } from "../pages/hearings/hearings.js";
import { renderNotifications } from "../pages/notifications/notifications.js";
import { renderPayments } from "../pages/payments/payments.js";
import { renderDashboard } from "../pages/dashboard/dashboard.js";
import { renderSettings } from "../pages/settings/settings.js";
import { renderLogin } from "../pages/login/login.js";

import { initDesktopNotifications } from "../js/desktopNotifications.js";

export function initRouter() {

    initDesktopNotifications();

    const content = document.getElementById("content");

    let currentPage = null;

    // ==========================
    // ROUTER CORE
    // ==========================
    async function loadPage() {

        const page = location.hash.replace("#", "");
        const token = localStorage.getItem("access");

        // ======================
        // DEFAULT ROUTE
        // ======================
        if (!page) {
            location.hash = token ? "dashboard" : "login";
            return;
        }

        // ======================
        // LOGIN GUARD
        // ======================
        if (!token && page !== "login") {
            location.hash = "login";
            return;
        }

        // ======================
        // PREVENT RE-RENDER
        // ======================
        if (currentPage === page) return;
        currentPage = page;

        // ======================
        // CLEAR VIEW
        // ======================
        content.innerHTML = "";

        // ======================
        // ROUTES
        // ======================
        switch (page) {

            case "login":
                renderLogin();
                break;

            case "dashboard":
                renderDashboard();
                break;

            case "accounts":
                renderAccounts();
                break;

            case "clients":
                renderClients();
                break;

            case "cases":
                renderCases();
                break;

            case "documents":
                renderDocuments();
                break;

            case "hearings":
                renderHearings();
                break;

            case "notifications":
                renderNotifications();
                break;

            case "payments":
                renderPayments();
                break;

            case "settings":
                renderSettings();
                break;

            default:
                content.innerHTML = `
                    <div style="padding:20px">
                        <h2>الصفحة غير موجودة</h2>
                    </div>
                `;
        }
    }

    // ==========================
    // EVENTS
    // ==========================
    window.addEventListener("hashchange", loadPage);

    loadPage();
}