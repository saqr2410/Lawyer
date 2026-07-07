export function renderSidebar() {

    document.getElementById("sidebar").innerHTML = `

        <div class="sidebar">

            <div class="menu">

                <a href="#dashboard">🏠 الرئيسية</a>

                <a href="#clients">👥 العملاء</a>

                <a href="#cases">⚖ القضايا</a>

                <a href="#hearings">🏛 الجلسات</a>

                <a href="#documents">📂 المستندات</a>

                <a href="#payments">💳 المدفوعات</a>

                <a href="#accounts">👤 المستخدمين</a>

                <a href="#notifications">🔔 الإشعارات</a>

                <a href="#settings">⚙ الإعدادات</a>

            </div>

            <!-- Logout Button -->
            <button id="logoutBtn" class="logout-btn">
                🚪 تسجيل الخروج
            </button>

        </div>

    `;

    // =========================
    // LOGOUT (no import needed)
    // =========================
    document.getElementById("logoutBtn").onclick = function () {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        location.hash = "#login";
    };
}