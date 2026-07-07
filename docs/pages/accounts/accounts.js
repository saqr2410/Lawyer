import { apiRequest } from "../../js/api.js";

export async function renderAccounts() {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="accounts-page" id="accountsPage"></div>
    `;

    const profileResponse = await apiRequest("/accounts/profile/");
    const me = profileResponse.data;

    if (me.role === "ADMIN") {
        renderAdminPage();
        loadUsers();
    } else {
        renderProfile(me);
    }
}

// =========================
// PROFILE
// =========================
function renderProfile(user) {

    const page = document.getElementById("accountsPage");

    page.innerHTML = `
        <div class="table-box">

            <h1>الملف الشخصي</h1>

            <p>الاسم: ${user.username}</p>
            <p>البريد: ${user.email || "-"}</p>
            <p>الهاتف: ${user.phone || "-"}</p>
            <p>الوظيفة: ${translateRole(user.role)}</p>

        </div>
    `;
}

// =========================
// ADMIN PAGE
// =========================
function renderAdminPage() {

    const page = document.getElementById("accountsPage");

    page.innerHTML = `
        <div class="accounts-header">
            <h1>المستخدمين</h1>
            <button id="addUserBtn">+ إضافة مستخدم</button>
        </div>

        <div id="userFormArea"></div>

        <div class="table-box">
            <table>
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>البريد</th>
                        <th>الهاتف</th>
                        <th>الصلاحية</th>
                        <th>إجراء</th>
                    </tr>
                </thead>

                <tbody id="usersTable"></tbody>
            </table>
        </div>
    `;

    document.getElementById("addUserBtn").onclick = () => {
        showUserForm();
    };
}

// =========================
// LOAD USERS
// =========================
async function loadUsers() {

    const response = await apiRequest("/accounts/users/");
    const users = response.data.results || response.data;

    const table = document.getElementById("usersTable");

    table.innerHTML = users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.email || "-"}</td>
            <td>${user.phone || "-"}</td>
            <td>${translateRole(user.role)}</td>
            <td>
                <button onclick="editUser(${user.id})">تعديل</button>
                <button onclick="deleteUser(${user.id})">حذف</button>
            </td>
        </tr>
    `).join("");
}

// =========================
// USER FORM
// =========================
function showUserForm(user = null) {

    const area = document.getElementById("userFormArea");

    area.innerHTML = `
        <div class="table-box">

            <input id="username" placeholder="اسم المستخدم"
                value="${user?.username || ""}">

            <input id="email" placeholder="البريد"
                value="${user?.email || ""}">

            <input id="phone" placeholder="الهاتف"
                value="${user?.phone || ""}">

            <input id="password" type="password" placeholder="كلمة المرور">

            <select id="role">
                <option value="LAWYER">محامي</option>
                <option value="SECRETARY">سكرتير</option>
                <option value="ADMIN">مدير</option>
            </select>

            <button id="saveUser">حفظ</button>
            <button id="cancelUser">إلغاء</button>

        </div>
    `;

    document.getElementById("saveUser").onclick = async () => {

        const username = document.getElementById("username");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const password = document.getElementById("password");
        const role = document.getElementById("role");

        const data = {
            username: username.value,
            email: email.value,
            phone: phone.value,
            role: role.value
        };

        if (password.value) {
            data.password = password.value;
        }

        if (user) {

            await apiRequest(`/accounts/users/${user.id}/`, {
                method: "PATCH",
                body: JSON.stringify(data)
            });

        } else {

            await apiRequest("/accounts/register/", {
                method: "POST",
                body: JSON.stringify(data)
            });
        }

        area.innerHTML = "";
        loadUsers();
    };

    document.getElementById("cancelUser").onclick = () => {
        area.innerHTML = "";
    };
}

// =========================
// GLOBAL FUNCTIONS
// =========================
window.editUser = async function (id) {

    const response = await apiRequest(`/accounts/users/${id}/`);
    showUserForm(response.data);
};

window.deleteUser = async function (id) {

    if (!confirm("هل تريد حذف المستخدم؟")) return;

    await apiRequest(`/accounts/users/${id}/`, {
        method: "DELETE"
    });

    loadUsers();
};

// =========================
// ROLE TRANSLATION
// =========================
function translateRole(role) {

    return {
        ADMIN: "مدير",
        LAWYER: "محامي",
        SECRETARY: "سكرتير"
    }[role] || role;
}