import { apiRequest } from "../../js/api.js";


export async function renderPayments(){


const content =
document.getElementById("content");



content.innerHTML = `


<div class="payments-page">



<div class="payments-header">


<h1>
المدفوعات
</h1>



<button id="addPaymentBtn">

+ إضافة دفعة

</button>



</div>




<div id="paymentFormArea"></div>




<div class="payments-table">


<table>


<thead>


<tr>


<th>
رقم القضية
</th>


<th>
المبلغ
</th>


<th>
طريقة الدفع
</th>


<th>
التاريخ
</th>


<th>
بواسطة
</th>


<th>
ملاحظات
</th>


<th>
إجراء
</th>


</tr>


</thead>



<tbody id="paymentsTable">


</tbody>



</table>



</div>



</div>


`;



document
.getElementById("addPaymentBtn")
.onclick = ()=>{


showPaymentForm();


};



loadPayments();


}









async function loadPayments(){


const response =
await apiRequest("/payments/");



const payments =
response.data.results || response.data;



const table =
document.getElementById("paymentsTable");



if(!Array.isArray(payments)){


table.innerHTML = `

<tr>

<td colspan="7">

لا توجد بيانات

</td>

</tr>

`;

return;

}




table.innerHTML = payments.map(p=>`


<tr>


<td>
${p.case_number || "-"}
</td>


<td>
${p.amount} جنيه
</td>


<td>
${translateMethod(p.payment_method)}
</td>


<td>
${p.payment_date || "-"}
</td>


<td>
${p.created_by_username || "-"}
</td>


<td>
${p.notes || "-"}
</td>


<td>


<button onclick="editPayment(${p.id})">
تعديل
</button>



<button onclick="deletePayment(${p.id})">
حذف
</button>



</td>


</tr>


`).join("");



}









async function showPaymentForm(item=null){



const area =
document.getElementById("paymentFormArea");



area.innerHTML = `


<div class="payments-table">


<h2>

${item ? "تعديل دفعة" : "إضافة دفعة"}

</h2>



<br>



<select id="case">


<option value="">
اختر القضية
</option>


</select>




<br><br>




<input

id="amount"

type="number"

placeholder="المبلغ"

value="${item?.amount || ""}"

>



<br><br>




<select id="payment_method">


<option value="CASH">

كاش

</option>



<option value="TRANSFER">

تحويل بنكي

</option>



<option value="OTHER">

أخرى

</option>



</select>




<br><br>




<textarea

id="notes"

placeholder="ملاحظات"

>${item?.notes || ""}</textarea>



<br><br>




<button id="savePayment">

حفظ

</button>



<button id="cancelPayment">

إلغاء

</button>



</div>



`;





await loadCasesForSelect(item?.case);




if(item){


document.getElementById("payment_method").value =
item.payment_method;


}





document
.getElementById("savePayment")
.onclick = async()=>{



const caseId =
document.getElementById("case").value;



const amount =
document.getElementById("amount").value;




if(!caseId){

alert("اختر القضية");

return;

}




if(!amount || amount <=0){

alert("اكتب مبلغ صحيح");

return;

}





const data = {


case:Number(caseId),


amount:Number(amount),


payment_method:
document.getElementById("payment_method").value,


notes:
document.getElementById("notes").value



};





if(item){


await apiRequest(


`/payments/${item.id}/`,


{

method:"PATCH",

body:JSON.stringify(data)

}


);



}

else{


await apiRequest(


"/payments/",


{

method:"POST",

body:JSON.stringify(data)

}


);



}




area.innerHTML="";


loadPayments();



};






document
.getElementById("cancelPayment")
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



select.innerHTML = `

<option value="">

اختر القضية

</option>

`;



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









window.editPayment = async function(id){


const res =
await apiRequest(

`/payments/${id}/`

);



showPaymentForm(
res.data
);



}









window.deletePayment = async function(id){


if(!confirm("حذف الدفعة؟"))

return;




await apiRequest(

`/payments/${id}/`,

{

method:"DELETE"

}

);



loadPayments();



}








function translateMethod(method){


return {


"CASH":"كاش",

"TRANSFER":"تحويل بنكي",

"OTHER":"أخرى"


}[method] || method;


}