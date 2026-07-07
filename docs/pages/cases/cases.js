import { apiRequest } from "../../js/api.js";


let editId = null;



export async function renderCases(){


const content = document.getElementById("content");



content.innerHTML = `


<div class="clients-page">


<div class="page-header">

<h1>
إدارة القضايا ⚖️
</h1>


<button id="addCase" class="btn">
+ قضية جديدة
</button>


</div>




<div class="search-box">

<input id="caseSearch"
placeholder="ابحث برقم القضية أو اسم العميل أو المحكمة">

</div>




<div class="table-box">

<table>

<thead>

<tr>

<th>رقم القضية</th>
<th>العنوان</th>
<th>العميل</th>
<th>المحكمة</th>
<th>الحالة</th>
<th>الإجراءات</th>

</tr>

</thead>


<tbody id="casesTable"></tbody>


</table>


</div>


</div>






<div id="caseModal" class="modal">


<div class="modal-box">


<h2 id="modalTitle">
إضافة قضية
</h2>




<input id="case_number"
placeholder="رقم القضية">



<input id="title"
placeholder="عنوان القضية">




<select id="client">

<option value="">
اختر العميل (اختياري)
</option>

</select>



<input id="newClient"
placeholder="أو اكتب اسم عميل جديد">





<input id="court_name"
placeholder="اسم المحكمة">





<select id="status">

<option value="">
اختر حالة القضية
</option>

<option value="OPEN">
مفتوحة
</option>

<option value="IN_PROGRESS">
قيد التنفيذ
</option>

<option value="POSTPONED">
مؤجلة
</option>

<option value="WON">
مكسوبة
</option>

<option value="LOST">
مخسورة
</option>

<option value="CLOSED">
مغلقة
</option>

</select>





<textarea id="description"
placeholder="الوصف"></textarea>





<button id="saveCase" class="btn">
حفظ
</button>


<button id="closeModal" class="cancel">
إلغاء
</button>



</div>

</div>


`;





const modal = document.getElementById("caseModal");








async function loadCases(search=""){


let url="/cases/";



if(search){

url += `?search=${search}`;

}



const res = await apiRequest(url);



const cases =
res.data.results || res.data;



const table =
document.getElementById("casesTable");



table.innerHTML="";



cases.forEach(c=>{


table.innerHTML += `


<tr>


<td>${c.case_number || "-"}</td>


<td>${c.title || "-"}</td>


<td>${c.client_name || "-"}</td>


<td>${c.court_name || "-"}</td>


<td>${c.status || "-"}</td>



<td>


<button class="edit" data-id="${c.id}">
تعديل
</button>



<button class="delete" data-id="${c.id}">
حذف
</button>


</td>


</tr>


`;



});


}









async function loadClients(){


const res =
await apiRequest("/clients/clients/");



const clients =
res.data.results || res.data;



const select =
document.getElementById("client");



clients.forEach(c=>{


select.innerHTML += `


<option value="${c.id}">

${c.full_name}

</option>


`;



});


}








loadCases();

loadClients();









document.getElementById("addCase").onclick=()=>{


editId=null;


document.getElementById("modalTitle").innerText =
"إضافة قضية";



document.getElementById("case_number").value="";

document.getElementById("title").value="";

document.getElementById("client").value="";

document.getElementById("newClient").value="";

document.getElementById("court_name").value="";

document.getElementById("status").value="";

document.getElementById("description").value="";



modal.classList.add("show");


};













document.getElementById("saveCase").onclick=async()=>{



const data = {



case_number:

document.getElementById("case_number").value,



title:

document.getElementById("title").value,



court_name:

document.getElementById("court_name").value,



description:

document.getElementById("description").value



};









// الحالة إجبارية


const status =

document.getElementById("status").value;




if(!status){


alert("اختر حالة القضية");


return;


}



data.status = status;



// العميل


let client =

document.getElementById("client").value;



let newClient =

document.getElementById("newClient").value.trim();







if(client){


data.client = client;


}



else if(newClient){



const newClientRes =

await apiRequest(

"/clients/clients/",

{


method:"POST",


body:JSON.stringify({

full_name:newClient

})


}

);



data.client = newClientRes.data.id;



}




if(editId){



await apiRequest(


`/cases/${editId}/`,


{


method:"PATCH",


body:JSON.stringify(data)


}


);



}



else{



await apiRequest(


"/cases/",


{


method:"POST",


body:JSON.stringify(data)


}


);



}







modal.classList.remove("show");



loadCases();



};














document.getElementById("casesTable").onclick = async(e)=>{



const id = e.target.dataset.id;






if(e.target.classList.contains("delete")){



if(confirm("حذف القضية؟")){



await apiRequest(


`/cases/${id}/`,


{


method:"DELETE"


}


);



loadCases();


}



}









if(e.target.classList.contains("edit")){



editId=id;



const res =

await apiRequest(

`/cases/${id}/`

);



const c = res.data;







document.getElementById("case_number").value =
c.case_number || "";



document.getElementById("title").value =
c.title || "";



document.getElementById("client").value =
c.client || "";



document.getElementById("newClient").value = "";



document.getElementById("court_name").value =
c.court_name || "";



document.getElementById("status").value =
c.status || "";



document.getElementById("description").value =
c.description || "";







document.getElementById("modalTitle").innerText =
"تعديل قضية";



modal.classList.add("show");



}



};









document.getElementById("closeModal").onclick=()=>{


modal.classList.remove("show");


};










document.getElementById("caseSearch").oninput=(e)=>{


loadCases(

e.target.value

);


};





}