import { apiRequest } from "../../js/api.js";


let editId = null;



export async function renderClients(){


const content =
document.getElementById("content");



content.innerHTML = `



<div class="clients-page">



<div class="page-header">


<h1>
إدارة العملاء
</h1>


<button id="addClient" class="btn">
+ إضافة عميل
</button>


</div>





<div class="search-box">


<input

id="clientSearch"

placeholder="ابحث بالاسم أو الرقم القومي"

>


</div>






<div class="table-box">


<table>


<thead>


<tr>


<th>
الاسم
</th>


<th>
الهاتف
</th>


<th>
البريد
</th>


<th>
الرقم القومي
</th>


<th>
العنوان
</th>


<th>
الإجراءات
</th>


</tr>


</thead>



<tbody id="clientsTable">


</tbody>


</table>


</div>



</div>







<div id="clientModal" class="modal">



<div class="modal-box">



<h2 id="modalTitle">
إضافة عميل
</h2>





<input 
id="full_name"
placeholder="الاسم كامل">



<input 
id="phone"
placeholder="رقم الهاتف">



<input 
id="email"
placeholder="البريد الإلكتروني">



<input 
id="national_id"
placeholder="الرقم القومي">



<input 
id="address"
placeholder="العنوان">



<textarea
id="notes"
placeholder="ملاحظات">
</textarea>





<button id="saveClient" class="btn">

حفظ

</button>



<button id="closeModal" class="cancel">

إلغاء

</button>



</div>



</div>



`;




const modal =
document.getElementById("clientModal");







async function loadClients(search=""){



try{



let url =
"/clients/clients/";




if(search){


url +=
`?search=${search}`;


}






const res =
await apiRequest(url);



const clients =
res.data.results || res.data;





const table =
document.getElementById(
"clientsTable"
);





table.innerHTML="";






if(clients.length === 0){


table.innerHTML=`


<tr>


<td colspan="6">


لا يوجد عملاء


</td>


</tr>


`;


return;


}






clients.forEach(client=>{


table.innerHTML += `



<tr>



<td>
${client.full_name}
</td>



<td>
${client.phone || "-"}
</td>



<td>
${client.email || "-"}
</td>



<td>
${client.national_id || "-"}
</td>



<td>
${client.address || "-"}
</td>



<td>



<button 
class="edit"
data-id="${client.id}">

تعديل

</button>




<button 
class="delete"
data-id="${client.id}">

حذف

</button>



</td>



</tr>



`;



});



}



catch(error){


console.log(
error
);


}



}







loadClients();










document
.getElementById("addClient")
.onclick = ()=>{


editId=null;



document
.getElementById("modalTitle")
.innerText =
"إضافة عميل";



document
.querySelectorAll(".modal-box input")
.forEach(
input=>input.value=""
);



document
.getElementById("notes")
.value="";



modal.classList.add("show");



};









document
.getElementById("closeModal")
.onclick = ()=>{


modal.classList.remove("show");


};










document
.getElementById("saveClient")
.onclick = async ()=>{





const data = {



full_name:

document
.getElementById("full_name")
.value,



phone:

document
.getElementById("phone")
.value,



email:

document
.getElementById("email")
.value,



national_id:

document
.getElementById("national_id")
.value,



address:

document
.getElementById("address")
.value,



notes:

document
.getElementById("notes")
.value



};







try{





if(editId){



await apiRequest(

`/clients/clients/${editId}/`,

{

method:"PATCH",

body:
JSON.stringify(data)

}

);



}

else{



await apiRequest(

"/clients/clients/",

{

method:"POST",

body:
JSON.stringify(data)

}

);



}






modal.classList.remove("show");



loadClients();



}



catch(error){



console.log(
"Save Error",
error
);



}



};









document
.getElementById("clientsTable")
.onclick = async(e)=>{



const id =
e.target.dataset.id;






if(e.target.classList.contains("delete")){



if(confirm(
"هل تريد حذف العميل؟"
)){



await apiRequest(

`/clients/clients/${id}/`,

{

method:"DELETE"

}

);



loadClients();


}



}








if(e.target.classList.contains("edit")){



editId=id;





const res =
await apiRequest(

`/clients/clients/${id}/`

);



const c =
res.data;





document
.getElementById("full_name")
.value =
c.full_name;



document
.getElementById("phone")
.value =
c.phone || "";



document
.getElementById("email")
.value =
c.email || "";



document
.getElementById("national_id")
.value =
c.national_id || "";



document
.getElementById("address")
.value =
c.address || "";



document
.getElementById("notes")
.value =
c.notes || "";





document
.getElementById("modalTitle")
.innerText =
"تعديل عميل";



modal.classList.add("show");



}



};









document
.getElementById("clientSearch")
.oninput =
(e)=>{


loadClients(
e.target.value
);


};




}