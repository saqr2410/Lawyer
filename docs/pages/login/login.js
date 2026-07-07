import { apiRequest } from "../../js/api.js";

export function renderLogin() {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="login-page">
            <div class="login-card">

                <h1>الشافعي ⚖️</h1>

                <p>تسجيل الدخول</p>

                <input id="username" placeholder="اسم المستخدم">
                <input id="password" type="password" placeholder="كلمة المرور">

                <button id="loginBtn">دخول</button>

                <div id="msg"></div>

            </div>
        </div>
    `;

    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");
    const msg = document.getElementById("msg");

    loginBtn.onclick = async () => {

        const user = username.value.trim();
        const pass = password.value.trim();

        if (!user || !pass) {
            msg.innerText = "من فضلك أكمل البيانات";
            return;
        }

        loginBtn.disabled = true;
        loginBtn.innerText = "جاري الدخول...";
        msg.innerText = "";

        try {

            const res = await apiRequest("/accounts/login/", {
                method: "POST",
                body: JSON.stringify({
                    username: user,
                    password: pass
                })
            });

            console.log("LOGIN RESPONSE:", res);

            if (res.status === 200 && res.data?.access) {

                localStorage.setItem("access", res.data.access);
                localStorage.setItem("refresh", res.data.refresh);

                msg.innerText = "تم تسجيل الدخول بنجاح ✔️";

                // إعادة تحميل التطبيق بالكامل
                setTimeout(() => {

                    location.hash = "#dashboard";
                    window.location.reload();

                }, 300);

            } else {

                msg.innerText = "بيانات غير صحيحة ❌";

            }

        } catch (err) {

            console.error(err);

            msg.innerText = "خطأ في السيرفر";

        } finally {

            loginBtn.disabled = false;
            loginBtn.innerText = "دخول";

        }

    };

}