import { apiRequest } from "../../js/api.js";


export async function renderDocuments(){


const content =
document.getElementById("content");



content.innerHTML = `


<div class="documents-page">



<div class="documents-header">


<h1>
المستندات
</h1>



<button id="addDocumentBtn">

+ رفع مستند

</button>



</div>




<div id="documentFormArea"></div>





<div class="documents-table">


<table>


<thead>


<tr>


<th>العنوان</th>

<th>القضية</th>

<th>النوع</th>

<th>بواسطة</th>

<th>الملف</th>

<th>إجراء</th>


</tr>


</thead>




<tbody id="documentsTable">


<tr>

<td colspan="6">

جاري التحميل...

</td>

</tr>


</tbody>


</table>


</div>



</div>


`;




document
.getElementById("addDocumentBtn")
.onclick = ()=>{


showDocumentForm();


};



loadDocuments();


}







async function loadDocuments(){



const response =
await apiRequest("/documents/");



const documents =
response.data.results || response.data;



const table =
document.getElementById("documentsTable");



if(!Array.isArray(documents)){


table.innerHTML = `

<tr>

<td colspan="6">

لا توجد بيانات

</td>

</tr>

`;

return;

}




table.innerHTML = documents.map(doc=>`


<tr>


<td>

${doc.title || "-"}

</td>



<td>

${doc.case_number || "-"}

</td>



<td>

${translateType(doc.document_type)}

</td>



<td>

${doc.uploaded_by_username || "-"}

</td>




<td>


${
doc.file

?

`
<a 
href="http://127.0.0.1:8000${doc.file}"
target="_blank"
>

فتح

</a>
`

:

"-"

}


</td>





<td>


<button onclick="editDocument(${doc.id})">

تعديل

</button>



<button onclick="deleteDocument(${doc.id})">

حذف

</button>



</td>



</tr>



`).join("");



}









async function showDocumentForm(item=null){



const area =
document.getElementById("documentFormArea");



area.innerHTML = `


<div class="documents-table">


<h2>

${item ? "تعديل مستند" : "رفع مستند"}

</h2>



<br>




<input

id="title"

placeholder="عنوان المستند"

value="${item?.title || ""}"

>




<br><br>





<select id="case">


<option value="">

اختر القضية

</option>


</select>





<br><br>






<select id="document_type">


<option value="CONTRACT">

عقد

</option>




<option value="COURT">

مستند محكمة

</option>





<option value="ID">

بطاقة

</option>





<option value="OTHER">

أخرى

</option>



</select>





<br><br>





<input

id="file"

type="file"

>





<br><br>





<button id="saveDocument">

حفظ

</button>



<button id="cancelDocument">

إلغاء

</button>



</div>


`;





await loadCasesForSelect(
item?.case
);





if(item){


document.getElementById("document_type").value =
item.document_type;


}






document
.getElementById("cancelDocument")
.onclick = ()=>{


area.innerHTML="";


};








document
.getElementById("saveDocument")
.onclick = async ()=>{





const formData =
new FormData();






formData.append(

"title",

document.getElementById("title").value

);






formData.append(

"case",

document.getElementById("case").value

);






formData.append(

"document_type",

document.getElementById("document_type").value

);







const file =
document.getElementById("file").files[0];





if(file){


formData.append(

"file",

file

);


}







try{





if(item){



await apiRequest(


`/documents/${item.id}/`,


{


method:"PATCH",


body:formData


}


);




}

else{





if(!file){


alert("اختر ملف");


return;


}





await apiRequest(


"/documents/",


{


method:"POST",


body:formData


}


);



}





area.innerHTML="";



loadDocuments();





}





catch(error){



console.log(

"DOCUMENT ERROR",

error.data || error

);



}





};



}









async function loadCasesForSelect(selected=null){



const response =
await apiRequest("/cases/");



const cases =
response.data.results || response.data;



const select =
document.getElementById("case");



if(!Array.isArray(cases))

return;





select.innerHTML = `


<option value="">


اختر القضية


</option>


`;





cases.forEach(c=>{



select.innerHTML += `


<option


value="${c.id}"


${selected == c.id ? "selected":""}


>


${c.case_number} - ${c.title}


</option>


`;



});



}










window.editDocument = async function(id){



const res =

await apiRequest(

`/documents/${id}/`

);





showDocumentForm(

res.data

);



};










window.deleteDocument = async function(id){



if(!confirm("هل تريد حذف المستند؟"))

return;





await apiRequest(


`/documents/${id}/`,


{


method:"DELETE"


}


);




loadDocuments();



};










function translateType(type){



return {


CONTRACT:"عقد",


COURT:"مستند محكمة",


ID:"بطاقة",


OTHER:"أخرى"



}[type] || type;



}