const {

collection,
onSnapshot,
query,
orderBy

} = window.firebaseFns;

const db = window.db;

const guestTable =
document.getElementById(
"guestTable"
);

const totalCount =
document.getElementById(
"totalCount"
);

const yesCount =
document.getElementById(
"yesCount"
);

const noCount =
document.getElementById(
"noCount"
);

const maybeCount =
document.getElementById(
"maybeCount"
);

/* =========================
   LOAD GUESTS
========================= */

const q = query(

collection(
db,
"guests"
),

orderBy(
"createdAt",
"desc"
)

);

onSnapshot(q,(snapshot)=>{

guestTable.innerHTML = "";

let total = 0;
let yes = 0;
let no = 0;
let maybe = 0;

if(snapshot.empty){

guestTable.innerHTML = `

<tr>
<td colspan="5" class="empty">
Henüz veri yok
</td>
</tr>

`;

}

snapshot.forEach((doc)=>{

const data = doc.data();

total++;

if(data.status === "geliyor"){
yes++;
}

if(data.status === "gelmiyor"){
no++;
}

if(data.status === "kararsiz"){
maybe++;
}

const row =
document.createElement("tr");

row.innerHTML = `

<td>
${data.name || "-"}
</td>

<td>
${data.phone || "-"}
</td>

<td>
${data.people || "-"}
</td>

<td>

<span class="status ${data.status}">

${

data.status === "yes"
? "Katılıyor"

:

data.status === "no"
? "Katılmıyor"

:

"Kararsız"

}

</span>

</td>

<td>
${data.note || "-"}
</td>

`;

guestTable.appendChild(
row
);

});

totalCount.textContent =
total;

yesCount.textContent =
yes;

noCount.textContent =
no;

maybeCount.textContent =
maybe;

});

/* =========================
   EXPORT
========================= */

window.exportData = ()=>{

let csv =
"İsim,Telefon,Kişi Sayısı,Durum,Not\n";

const rows =
document.querySelectorAll(
"#guestTable tr"
);

rows.forEach((row)=>{

const cols =
row.querySelectorAll("td");

if(cols.length){

let data = [];

cols.forEach((col)=>{

data.push(
col.innerText
.replace(/,/g," ")
);

});

csv +=
data.join(",") + "\n";

}

});

const blob =
new Blob([csv],{
type:"text/csv"
});

const url =
URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href = url;

a.download =
"gokce-yalcin-katilimlar.csv";

a.click();

URL.revokeObjectURL(url);

};
