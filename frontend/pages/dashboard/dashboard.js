import { apiRequest } from "../../js/api.js";



export async function renderDashboard(){



const content =
document.getElementById("content");



content.innerHTML = `



<div class="law-dashboard">



<h1 class="dashboard-title">
الشافعي ⚖️
</h1>



<p class="dashboard-subtitle">
ملخص أعمال المكتب
</p>





<div class="law-cards">





<div class="law-card clients">



<div class="card-head">

<span class="card-icon">
👥
</span>


<h3>
العملاء
</h3>


</div>



<strong id="clients">
0
</strong>



<p>
إجمالي العملاء
</p>



</div>








<div class="law-card cases">



<div class="card-head">

<span class="card-icon">
⚖️
</span>



<h3>
القضايا
</h3>



</div>




<strong id="cases">
0
</strong>




<p>
القضايا المسجلة
</p>




</div>









<div class="law-card hearings">



<div class="card-head">


<span class="card-icon">
📅
</span>



<h3>
جلسات الغد
</h3>



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


<span class="card-icon">
💰
</span>



<h3>
الإيرادات
</h3>



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


<span class="card-icon">
🔔
</span>



<h3>
التنبيهات
</h3>



</div>





<strong id="notifications">
0
</strong>





<p>
غير مقروءة
</p>



</div>





</div>





</div>



`;






// فتح الصفحات عند الضغط على الكروت


document
.querySelector(".clients")
.onclick = ()=>{

location.hash = "clients";

};




document
.querySelector(".cases")
.onclick = ()=>{

location.hash = "cases";

};




document
.querySelector(".hearings")
.onclick = ()=>{

location.hash = "hearings";

};




document
.querySelector(".payments")
.onclick = ()=>{

location.hash = "payments";

};




document
.querySelector(".notifications")
.onclick = ()=>{

location.hash = "notifications";

};









try{



const res = await apiRequest(

"/dashboard/"

);




const data =
res.data;






document.getElementById("clients").innerText =

data.clients ?? 0;





document.getElementById("cases").innerText =

data.cases ?? 0;






document.getElementById("hearings").innerText =

data.hearings_tomorrow ?? 0;






document.getElementById("payments").innerText =

data.payments ?? 0;






document.getElementById("notifications").innerText =

data.notifications ?? 0;





}



catch(error){



console.log(

"DASHBOARD ERROR",

error

);



}



}