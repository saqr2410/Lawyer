import {apiRequest} from "../../js/api.js";


export async function renderSettings(){


const content =
document.getElementById("content");



content.innerHTML = `


<div class="settings-page">


<h1>
الإعدادات
</h1>



<div class="settings-card">



<input id="first_name" placeholder="الاسم الأول">


<input id="last_name" placeholder="الاسم الأخير">


<input id="email" placeholder="البريد">


<input id="phone" placeholder="الهاتف">


<h3>
بيانات المكتب
</h3>



<input id="office_name" placeholder="اسم المكتب">


<input id="specialization" placeholder="التخصص">


<input id="bar_number" placeholder="رقم النقابة">


<textarea id="address" placeholder="العنوان"></textarea>



<button id="saveSettings">

حفظ التعديلات

</button>



</div>


</div>

`;




loadSettings();


}



async function loadSettings(){


const res =
await apiRequest("/settings/");



const u = res.data;



first_name.value =
u.first_name || "";

last_name.value =
u.last_name || "";

email.value =
u.email || "";

phone.value =
u.phone || "";



office_name.value =
u.lawyer_profile?.office_name || "";


specialization.value =
u.lawyer_profile?.specialization || "";


bar_number.value =
u.lawyer_profile?.bar_number || "";


address.value =
u.lawyer_profile?.address || "";





document
.getElementById("saveSettings")
.onclick =
saveSettings;



}




async function saveSettings(){



await apiRequest(

"/settings/",

{


method:"PATCH",


body:JSON.stringify({


first_name:first_name.value,


last_name:last_name.value,


email:email.value,


phone:phone.value,



lawyer_profile:{


office_name:office_name.value,


specialization:specialization.value,


bar_number:bar_number.value,


address:address.value


}



})

}


);



alert("تم الحفظ");



}