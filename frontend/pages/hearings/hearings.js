import { apiRequest } from "../../js/api.js";



export async function renderHearings(){


const content =
document.getElementById("content");



content.innerHTML = `


<div class="hearings-page">


<div class="hearings-header">


<h1>
الجلسات
</h1>



<div>


<input

id="hearingSearch"

type="text"

placeholder="بحث برقم القضية..."

>



<button id="deleteAllHearings">

حذف كل الجلسات

</button>




<button id="addHearingBtn">

+ إضافة جلسة

</button>



</div>



</div>





<div id="hearingFormArea"></div>





<div class="hearings-table">


<table>


<thead>

<tr>

<th>القضية</th>
<th>تاريخ الجلسة</th>
<th>المحكمة</th>
<th>القاضي</th>
<th>القاعة</th>
<th>الحالة</th>
<th>إجراء</th>

</tr>

</thead>



<tbody id="hearingsTable">

</tbody>



</table>



</div>



</div>


`;







document
.getElementById("addHearingBtn")
.onclick = ()=>{

showHearingForm();

};






document
.getElementById("deleteAllHearings")
.onclick = async ()=>{


if(!confirm("حذف كل الجلسات؟"))

return;



await apiRequest(

"/hearings/delete_all/",

{

method:"DELETE"

}

);



loadHearings();



};







document
.getElementById("hearingSearch")
.addEventListener(
"input",
(e)=>{


loadHearings(
e.target.value
);


}

);




loadHearings();



}









async function loadHearings(search=""){



const response =
await apiRequest("/hearings/");



let hearings =
response.data.results || response.data;



const table =
document.getElementById("hearingsTable");





if(search){


search =
search.trim();




hearings =
hearings.filter(h=>{


return String(

h.case_number

)

.includes(search);



});


}







if(!Array.isArray(hearings)

|| hearings.length === 0){



table.innerHTML = `

<tr>

<td colspan="7">

لا توجد بيانات

</td>

</tr>

`;

return;


}







table.innerHTML = hearings.map(h=>`


<tr>


<td>


${h.case_number || "-"}


<br>


${h.case_title || ""}



</td>





<td>

${formatDate(h.hearing_date)}

</td>




<td>

${h.court_name || "-"}

</td>




<td>

${h.judge_name || "-"}

</td>




<td>

${h.courtroom || "-"}

</td>




<td>

${translateStatus(h.status)}

</td>




<td>



<button onclick="editHearing(${h.id})">

تعديل

</button>




<button onclick="deleteHearing(${h.id})">

حذف

</button>



</td>



</tr>



`).join("");



}









async function showHearingForm(item=null){



const area =
document.getElementById("hearingFormArea");



area.innerHTML = `


<div class="hearings-table">


<h2>

${item ? "تعديل جلسة":"إضافة جلسة"}

</h2>




<label>

القضية

</label>



<select id="case">


<option value="">

اختر القضية

</option>


</select>





<br><br>





<label>

تاريخ ووقت الجلسة

</label>



<input

id="hearing_date"

type="datetime-local"

value="${
item?.hearing_date
?
item.hearing_date.substring(0,16)
:
""

}"

>






<br><br>





<input

id="court_name"

placeholder="المحكمة"

value="${item?.court_name || ""}"

>






<br><br>





<input

id="judge_name"

placeholder="القاضي"

value="${item?.judge_name || ""}"

>






<br><br>




<input

id="courtroom"

placeholder="القاعة"

value="${item?.courtroom || ""}"

>






<br><br>




<select id="status">


<option value="">

اختر الحالة

</option>



<option value="SCHEDULED">

محددة

</option>



<option value="COMPLETED">

تمت

</option>



<option value="POSTPONED">

مؤجلة

</option>



<option value="CANCELLED">

ملغاة

</option>



</select>






<br><br>





<textarea id="notes"

placeholder="ملاحظات"

>${item?.notes || ""}</textarea>






<br><br>





<textarea id="result"

placeholder="النتيجة"

>${item?.result || ""}</textarea>






<br><br>




<input

id="next_hearing_date"

type="datetime-local"

value="${
item?.next_hearing_date
?
item.next_hearing_date.substring(0,16)
:
""

}"

>






<br><br>





<button id="saveHearing">

حفظ

</button>



<button id="cancelHearing">

إلغاء

</button>



</div>


`;






await loadCasesForSelect(item?.case);




if(item){

document.getElementById("status").value =
item.status;

}





document
.getElementById("saveHearing")
.onclick = async()=>{



const caseId =
document.getElementById("case").value;



const date =
document.getElementById("hearing_date").value;



if(!caseId){

alert("اختر القضية");

return;

}





if(!date){

alert("اختر التاريخ");

return;

}





const data={


case:Number(caseId),


hearing_date:

date + ":00",



court_name:

document.getElementById("court_name").value,



judge_name:

document.getElementById("judge_name").value,



courtroom:

document.getElementById("courtroom").value,



status:

document.getElementById("status").value,



notes:

document.getElementById("notes").value,



result:

document.getElementById("result").value,



next_hearing_date:

document.getElementById("next_hearing_date").value

?

document.getElementById("next_hearing_date").value + ":00"

:

null


};







if(item){


await apiRequest(

`/hearings/${item.id}/`,

{

method:"PATCH",

body:JSON.stringify(data)

}

);


}

else{


await apiRequest(

"/hearings/",

{

method:"POST",

body:JSON.stringify(data)

}

);


}



area.innerHTML="";


loadHearings();



};






document
.getElementById("cancelHearing")
.onclick = ()=>{

area.innerHTML="";

};


}









async function loadCasesForSelect(selected=null){



const response =
await apiRequest("/cases/");



const cases =
response.data.results || response.data;



const select =
document.getElementById("case");



cases.forEach(c=>{


select.innerHTML += `


<option value="${c.id}"

${selected == c.id ? "selected":""}

>

${c.case_number} - ${c.title}

</option>


`;


});


}









window.editHearing = async function(id){


const res =
await apiRequest(`/hearings/${id}/`);


showHearingForm(res.data);


};








window.deleteHearing = async function(id){


if(!confirm("حذف الجلسة؟"))

return;



await apiRequest(

`/hearings/${id}/`,

{

method:"DELETE"

}

);



loadHearings();


};









function translateStatus(status){


return {


"SCHEDULED":"محددة",

"COMPLETED":"تمت",

"POSTPONED":"مؤجلة",

"CANCELLED":"ملغاة"


}[status] || status;



}









function formatDate(date){


if(!date)

return "-";



return new Date(date)

.toLocaleString("ar-EG");



}