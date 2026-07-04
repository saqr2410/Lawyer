import { apiRequest } from "../../js/api.js";

let notifications = [];
let filteredNotifications = [];

let currentFilter = "ALL";
let searchText = "";

// ==========================
// RENDER PAGE
// ==========================
export async function renderNotifications() {

    const content = document.getElementById("content");

    content.innerHTML = `

        <div class="notifications-page">

            <div class="notifications-header">

                <div>

                    <h1>الإشعارات</h1>

                    <p>
                        إدارة جميع إشعارات النظام
                    </p>

                </div>

                <div class="notification-actions">

                    <button id="refreshBtn">
                        🔄 تحديث
                    </button>

                    <button id="markAllBtn">
                        ✅ تحديد الكل كمقروء
                    </button>

                    <button id="deleteAllBtn">
                        🗑 حذف الكل
                    </button>

                </div>

            </div>

            <div class="notifications-toolbar">

                <input
                    id="searchNotification"
                    type="text"
                    placeholder="بحث..."
                >

                <select id="filterNotification">

                    <option value="ALL">
                        جميع الإشعارات
                    </option>

                    <option value="UNREAD">
                        غير المقروءة
                    </option>

                    <option value="READ">
                        المقروءة
                    </option>

                    <option value="HEARING">
                        الجلسات
                    </option>

                    <option value="PAYMENT">
                        المدفوعات
                    </option>

                    <option value="SYSTEM">
                        النظام
                    </option>

                </select>

            </div>

            <div
                id="notificationsList"
                class="notifications-list"
            >

                <div class="loading">

                    جاري تحميل الإشعارات...

                </div>

            </div>

        </div>

    `;

    document
        .getElementById("refreshBtn")
        .onclick = loadNotifications;

    document
        .getElementById("markAllBtn")
        .onclick = markAllRead;

    document
        .getElementById("deleteAllBtn")
        .onclick = deleteAllNotifications;

    document
        .getElementById("searchNotification")
        .addEventListener("input", e => {

            searchText = e.target.value.trim().toLowerCase();

            applyFilters();

        });

    document
        .getElementById("filterNotification")
        .addEventListener("change", e => {

            currentFilter = e.target.value;

            applyFilters();

        });

    await loadNotifications();

}

// ==========================
// LOAD NOTIFICATIONS
// ==========================
async function loadNotifications() {

    try {

        const res = await apiRequest(
            "/notifications/"
        );

        if (Array.isArray(res.data)) {

            notifications = res.data;

        }

        else if (Array.isArray(res.data.results)) {

            notifications = res.data.results;

        }

        else {

            notifications = [];

        }

        applyFilters();

    }

    catch (error) {

        console.error(error);

        document
            .getElementById("notificationsList")
            .innerHTML = `

                <div class="empty-state">

                    <h3>

                        حدث خطأ أثناء تحميل الإشعارات

                    </h3>

                </div>

            `;

    }

}

// ==========================
// FILTERS
// ==========================
function applyFilters() {

    filteredNotifications = [...notifications];

    switch (currentFilter) {

        case "UNREAD":

            filteredNotifications =
                filteredNotifications.filter(
                    n => !n.is_read
                );

            break;

        case "READ":

            filteredNotifications =
                filteredNotifications.filter(
                    n => n.is_read
                );

            break;

        case "HEARING":

            filteredNotifications =
                filteredNotifications.filter(
                    n => n.type === "HEARING"
                );

            break;

        case "PAYMENT":

            filteredNotifications =
                filteredNotifications.filter(
                    n => n.type === "PAYMENT"
                );

            break;

        case "SYSTEM":

            filteredNotifications =
                filteredNotifications.filter(
                    n => n.type === "SYSTEM"
                );

            break;

    }

    if (searchText) {

        filteredNotifications =
            filteredNotifications.filter(n =>

                n.title
                    .toLowerCase()
                    .includes(searchText)

                ||

                n.message
                    .toLowerCase()
                    .includes(searchText)

            );

    }

    renderNotificationsList();

}

// ==========================
// RENDER LIST
// ==========================
function renderNotificationsList() {

    const list = document.getElementById("notificationsList");

    if (!filteredNotifications.length) {

        list.innerHTML = `

            <div class="empty-state">

                <h3>لا توجد إشعارات</h3>

                <p>
                    لا توجد إشعارات مطابقة للبحث الحالي.
                </p>

            </div>

        `;

        return;

    }

    list.innerHTML = filteredNotifications.map(notification => `

        <div class="notification-card ${notification.is_read ? "read" : "unread"}">

            <div class="notification-top">

                <div>

                    <h3>

                        ${notification.title}

                    </h3>

                    <span class="notification-type">

                        ${translateType(notification.type)}

                    </span>

                    <span class="notification-event">

                        ${translateEvent(notification.event)}

                    </span>

                </div>

                <div class="notification-status">

                    ${
                        notification.is_read

                        ?

                        `<span class="status read">
                            ✔ تمت القراءة
                        </span>`

                        :

                        `<span class="status unread">
                            ● غير مقروء
                        </span>`
                    }

                </div>

            </div>

            <div class="notification-message">

                ${notification.message}

            </div>

            <div class="notification-info">

                <div>

                    <strong>موعد الإشعار:</strong>

                    ${formatDate(notification.scheduled_at)}

                </div>

                <div>

                    <strong>تاريخ الإنشاء:</strong>

                    ${formatDate(notification.created_at)}

                </div>

            </div>

            <div class="notification-actions">

                ${
                    !notification.is_read

                    ?

                    `

                    <button
                        class="mark-read"
                        data-id="${notification.id}"
                    >

                        ✔ تم القراءة

                    </button>

                    `

                    :

                    ""

                }

                <button
                    class="delete-notification"
                    data-id="${notification.id}"
                >

                    🗑 حذف

                </button>

            </div>

        </div>

    `).join("");

    attachEvents();

}

// ==========================
// EVENTS
// ==========================
function attachEvents() {

    document
        .querySelectorAll(".mark-read")
        .forEach(button => {

            button.onclick = () => {

                markRead(button.dataset.id);

            };

        });

    document
        .querySelectorAll(".delete-notification")
        .forEach(button => {

            button.onclick = () => {

                deleteNotification(button.dataset.id);

            };

        });

}

// ==========================
// MARK AS READ
// ==========================
async function markRead(id) {

    try {

        await apiRequest(

            `/notifications/${id}/mark_as_read/`,

            {
                method: "POST"
            }

        );

        await loadNotifications();

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================
// DELETE ONE
// ==========================
async function deleteNotification(id) {

    if (!confirm("هل تريد حذف هذا الإشعار؟")) {

        return;

    }

    try {

        await apiRequest(

            `/notifications/${id}/`,

            {
                method: "DELETE"
            }

        );

        await loadNotifications();

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================
// MARK ALL AS READ
// ==========================
async function markAllRead() {

    try {

        await apiRequest(

            "/notifications/mark_all_as_read/",

            {
                method: "POST"
            }

        );

        await loadNotifications();

    }

    catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء تحديث الإشعارات.");

    }

}

// ==========================
// DELETE ALL
// ==========================
async function deleteAllNotifications() {

    if (!confirm("هل تريد حذف جميع الإشعارات؟")) {

        return;

    }

    try {

        await apiRequest(

            "/notifications/delete_all/",

            {
                method: "DELETE"
            }

        );

        notifications = [];

        filteredNotifications = [];

        renderNotificationsList();

    }

    catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء حذف الإشعارات.");

    }

}

// ==========================
// HELPERS
// ==========================
function translateType(type) {

    const types = {

        HEARING: "جلسة",

        PAYMENT: "مدفوعات",

        SYSTEM: "النظام"

    };

    return types[type] || type;

}

function translateEvent(event) {

    const events = {

        HEARING_CREATED:
            "إنشاء جلسة",

        HEARING_REMINDER_DAY:
            "تذكير قبل الجلسة بيوم",

        PAYMENT_CREATED:
            "إنشاء دفعة",

        PAYMENT_REMINDER:
            "تذكير بالسداد",

        SYSTEM_MESSAGE:
            "رسالة من النظام"

    };

    return events[event] || event;

}

function formatDate(value) {

    if (!value) {

        return "-";

    }

    try {

        return new Date(value).toLocaleString(

            "ar-EG",

            {

                year: "numeric",

                month: "long",

                day: "numeric",

                hour: "2-digit",

                minute: "2-digit"

            }

        );

    }

    catch {

        return value;

    }

}



