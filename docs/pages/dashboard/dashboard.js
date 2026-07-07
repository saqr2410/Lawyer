import { apiRequest } from "../../js/api.js";


export async function renderDashboard() {

  const content =
    document.getElementById("content") ||
    document.getElementById("app");


  content.innerHTML = `

  <div class="law-dashboard">

    <h1 class="dashboard-title">
      <i class="fas fa-scale-balanced"></i> الشافعي ⚖️
    </h1>

    <p class="dashboard-subtitle">
      <i class="fas fa-chart-pie"></i>
      ملخص أعمال المكتب
    </p>


    <div id="status-message"></div>



    <!-- الكروت الرئيسية -->

    <div class="law-cards">


      <div class="law-card clients">
        <div class="card-head">
          <span class="card-icon">👥</span>
          <h3>العملاء</h3>
        </div>

        <strong id="clients">0</strong>

        <p>
          إجمالي العملاء
        </p>
      </div>



      <div class="law-card cases">

        <div class="card-head">
          <span class="card-icon">⚖️</span>
          <h3>القضايا</h3>
        </div>

        <strong id="cases">0</strong>

        <p>
          إجمالي القضايا
        </p>

      </div>




      <div class="law-card hearings">

        <div class="card-head">
          <span class="card-icon">📅</span>
          <h3>جلسات الغد</h3>
        </div>


        <strong id="hearings">
          0
        </strong>


        <p>
          جلسات قادمة
        </p>

      </div>




      <div class="law-card payments">

        <div class="card-head">
          <span class="card-icon">💰</span>
          <h3>الإيرادات</h3>
        </div>


        <strong id="payments">
          0
        </strong>


        <p>
          إجمالي المدفوعات
        </p>

      </div>




      <div class="law-card notifications">

        <div class="card-head">
          <span class="card-icon">🔔</span>
          <h3>التنبيهات</h3>
        </div>


        <strong id="notifications">
          0
        </strong>


        <p>
          غير مقروء
        </p>

      </div>


    </div>





    <!-- القضايا -->

    <h2 class="section-title">
      <i class="fas fa-folder-open"></i>
      القضايا بالتفصيل
    </h2>


    <div class="law-cards small">


      <div class="law-card">
        <h3>مفتوحة</h3>
        <strong id="openCases">0</strong>
      </div>


      <div class="law-card">
        <h3>قيد التنفيذ</h3>
        <strong id="progressCases">0</strong>
      </div>


      <div class="law-card">
        <h3>مغلقة</h3>
        <strong id="closedCases">0</strong>
      </div>


      <div class="law-card">
        <h3>مكسب</h3>
        <strong id="wonCases">0</strong>
      </div>


      <div class="law-card">
        <h3>خسارة</h3>
        <strong id="lostCases">0</strong>
      </div>


    </div>





    <!-- العملاء -->

    <h2 class="section-title">
        <i class="fas fa-users"></i>
        العملاء بالتفصيل
    </h2>

    <div class="law-cards small">

        <div class="law-card">
            <h3>عملاء اليوم</h3>
            <strong id="newClients">0</strong>
        </div>

        <div class="law-card">
            <h3>هذا الشهر</h3>
            <strong id="monthClients">0</strong>
        </div>

        <div class="law-card">
            <h3>لديهم قضايا</h3>
            <strong id="clientsWithCases">0</strong>
        </div>

        <div class="law-card">
            <h3>بدون قضايا</h3>
            <strong id="clientsWithoutCases">0</strong>
        </div>

    </div>






    <!-- الجلسات -->

    <h2 class="section-title">
      <i class="fas fa-calendar-alt"></i>
      الجلسات
    </h2>


    <div class="law-cards small">


      <div class="law-card">
        <h3>اليوم</h3>
        <strong id="todayHearings">0</strong>
      </div>


      <div class="law-card">
        <h3>غداً</h3>
        <strong id="tomorrowHearings">0</strong>
      </div>


      <div class="law-card">
        <h3>القادمة</h3>
        <strong id="upcomingHearings">0</strong>
      </div>


    </div>






    <!-- المدفوعات -->


    <h2 class="section-title">
      <i class="fas fa-money-bill-wave"></i>
      المدفوعات
    </h2>


    <div class="law-cards small">


      <div class="law-card">
        <h3>عدد العمليات</h3>
        <strong id="paymentsCount">
          0
        </strong>
      </div>



      <div class="law-card">
        <h3>مدفوعات اليوم</h3>
        <strong id="todayPayments">
          0
        </strong>
      </div>


    </div>






    <!-- الإشعارات -->


    <h2 class="section-title">

      <i class="fas fa-bell"></i>

      الإشعارات

    </h2>


    <div class="law-cards small">


      <div class="law-card">
        <h3>غير مقروء</h3>
        <strong id="unreadNotifications">
          0
        </strong>
      </div>



      <div class="law-card">
        <h3>تم إرسالها</h3>
        <strong id="sentNotifications">
          0
        </strong>
      </div>




      <div class="law-card">
        <h3>معلقة</h3>
        <strong id="pendingNotifications">
          0
        </strong>
      </div>




      <div class="law-card">
        <h3>اليوم</h3>
        <strong id="todayNotifications">
          0
        </strong>
      </div>


    </div>



  </div>

  `;



  // التنقل

  document.querySelector(".clients").onclick =
    () => location.hash = "clients";


  document.querySelector(".cases").onclick =
    () => location.hash = "cases";


  document.querySelector(".hearings").onclick =
    () => location.hash = "hearings";


  document.querySelector(".payments").onclick =
    () => location.hash = "payments";


  document.querySelector(".notifications").onclick =
    () => location.hash = "notifications";





  try {


    const res = await apiRequest("/dashboard/");


    const data = res.data || {};



    console.log(
      "📦 DASHBOARD DATA:",
      data
    );



    // الكروت الرئيسية

    clients.innerText =
      data.clients ?? 0;


    cases.innerText =
      data.cases ?? 0;


    hearings.innerText =
      data.hearings_tomorrow ?? 0;


    payments.innerText =
      data.payments ?? 0;


    notifications.innerText =
      data.notifications ?? 0;





    // القضايا

    openCases.innerText =
      data.open_cases ?? 0;


    progressCases.innerText =
      data.in_progress_cases ?? 0;


    closedCases.innerText =
      data.closed_cases ?? 0;


    wonCases.innerText =
      data.won_cases ?? 0;


    lostCases.innerText =
      data.lost_cases ?? 0;






    // العملاء


    newClients.innerText =
    data.new_clients ?? 0;


    monthClients.innerText =
    data.month_clients ?? 0;


    clientsWithCases.innerText =
    data.clients_with_cases ?? 0;


    clientsWithoutCases.innerText =
    data.clients_without_cases ?? 0;







    // الجلسات


    todayHearings.innerText =
      data.today_hearings ?? 0;


    tomorrowHearings.innerText =
      data.tomorrow_hearings ?? 0;


    upcomingHearings.innerText =
      data.upcoming_hearings ?? 0;







    // المدفوعات


    paymentsCount.innerText =
      data.payments_count ?? 0;


    todayPayments.innerText =
      data.today_payments ?? 0;







    // الإشعارات


    unreadNotifications.innerText =
      data.unread_notifications ?? 0;


    sentNotifications.innerText =
      data.sent_notifications ?? 0;


    pendingNotifications.innerText =
      data.pending_notifications ?? 0;


    todayNotifications.innerText =
      data.today_notifications ?? 0;



  }


  catch(error){


    console.log(
      "❌ DASHBOARD ERROR:",
      error
    );


  }


}