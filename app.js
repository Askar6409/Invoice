const STORAGE_KEY = "askar_invoice_data";
const HISTORY_KEY = "askar_invoice_history";

/* =========================
ELEMENTS
========================= */

const servicesList = document.getElementById("services-list");
const totalDisplay = document.getElementById("total-display");

const currentDate = document.getElementById("current-date");
const currentTime = document.getElementById("current-time");

const customerNameInput =
document.getElementById("customerName");

const newServiceNameInput =
document.getElementById("newServiceName");

const newServicePriceInput =
document.getElementById("newServicePrice");

const addServiceBtn =
document.getElementById("addServiceBtn");

const saveInvoiceBtn =
document.getElementById("saveInvoiceBtn");

const resetBtn =
document.getElementById("resetBtn");

const smsBtn =
document.getElementById("smsBtn");

const smsText =
document.getElementById("smsText");

const historyList =
document.getElementById("historyList");

const searchInvoice =
document.getElementById("searchInvoice");

/* =========================
DATE & TIME
========================= */

function getTodayPersian() {

return new Date().toLocaleDateString("fa-IR");

}

function getCurrentTimePersian() {

return new Date().toLocaleTimeString(
"fa-IR",
{
hour: "2-digit",
minute: "2-digit",
second: "2-digit"
}
);

}

/* =========================
MONEY (تومان)
========================= */

function formatMoney(value) {

return Number(value || 0)
.toLocaleString("fa-IR");

}

/* =========================
DEFAULT SERVICES
========================= */

function defaultServices() {

return [

{
  id: crypto.randomUUID(),
  name: "شستشو سرسیلندر",
  price: 400000,
  selected: false
},

{
  id: crypto.randomUUID(),
  name: "آبندی ۸ سوپاپ",
  price: 700000,
  selected: false
},

{
  id: crypto.randomUUID(),
  name: "آبندی ۱۶ سوپاپ",
  price: 1000000,
  selected: false
},

{
  id: crypto.randomUUID(),
  name: "کف‌تراشی ۸ سوپاپ",
  price: 500000,
  selected: false
},

{
  id: crypto.randomUUID(),
  name: "کف‌تراشی ۱۶ سوپاپ",
  price: 1500000,
  selected: false
},

{
  id: crypto.randomUUID(),
  name: "شستشو گیربکس",
  price: 400000,
  selected: false
},

{
  id: crypto.randomUUID(),
  name: "شستشو گیربکس کثیف",
  price: 500000,
  selected: false
}

];

}

/* =========================
STORAGE
========================= */

function loadState() {

const saved =
localStorage.getItem(STORAGE_KEY);

if (saved) {

const data =
JSON.parse(saved);

data.date =
getTodayPersian();

data.time =
getCurrentTimePersian();

return data;

}

return {

customerName: "",

date: getTodayPersian(),

time: getCurrentTimePersian(),

services: defaultServices()

};

}

function saveState() {

localStorage.setItem(
STORAGE_KEY,
JSON.stringify(state)
);

}

/* =========================
HISTORY
========================= */

function loadHistory() {

return JSON.parse(

localStorage.getItem(
  HISTORY_KEY
) || "[]"

);

}

function saveHistory(history) {

localStorage.setItem(

HISTORY_KEY,

JSON.stringify(history)

);

}

/* =========================
STATE
========================= */

let state = loadState();

/* =========================
CALCULATIONS
========================= */

function getSelectedServices() {

return state.services.filter(

service => service.selected

);

}

function getTotal() {

return getSelectedServices()

.reduce(

(sum, service) =>

sum + Number(service.price || 0),

0

);

}

/* =========================
SMS BUILDER
========================= */

function buildSmsText() {

const selected =
getSelectedServices();

let text = "";

text += "فاکتور تراشکاری عساکره\n\n";

text +=
"تاریخ: ${state.date}\n";

text +=
"ساعت: ${state.time}\n";

text +=
"نام مشتری: ${state.customerName || "-"}\n";

text +=
"----------------------\n";

if(selected.length === 0){

text +=
"خدمتی انتخاب نشده است.\n";

} else {

selected.forEach(

  (service,index)=>{

    text +=
    `${index + 1}. ${service.name}

- ${formatMoney(service.price)}
  تومان\n`;
  
  }
  
  );

}

text +=
"----------------------\n";

text +=
"مجموع: ${formatMoney(getTotal())} تومان";

return text;

}
/* =========================
UPDATE TOTAL
========================= */

function updateTotal() {

totalDisplay.textContent =
"${formatMoney(getTotal())} تومان";

smsText.value =
buildSmsText();

}

/* =========================
RENDER SERVICES
========================= */

function render() {

currentDate.textContent =
state.date;

currentTime.textContent =
state.time;

customerNameInput.value =
state.customerName || "";

servicesList.innerHTML = "";

state.services.forEach(
(service,index)=>{

  const row =
  document.createElement("div");

  row.className =
  "service-row";

  row.innerHTML = `

  <div class="row-index">

    ${index + 1}

  </div>

  <div class="service-name">

    <input
      type="checkbox"
      data-id="${service.id}"
      ${service.selected ? "checked" : ""}>

    <span class="service-title">

      ${service.name}

    </span>

  </div>

  <div class="service-price">

    ${formatMoney(service.price)}
    تومان

  </div>

  <div class="actions-icons">

    <button
      class="icon-btn edit"
      data-edit="${service.id}">

      <i class='bx bx-pencil'></i>

    </button>

    <button
      class="icon-btn delete"
      data-delete="${service.id}">

      <i class='bx bx-trash'></i>

    </button>

  </div>

  `;

  servicesList.appendChild(row);

}

);

updateTotal();

saveState();

}

/* =========================
CHECKBOX CHANGE
========================= */

servicesList.addEventListener(
"change",
(e)=>{

if(
  e.target.matches(
  'input[type="checkbox"][data-id]'
  )
){

  const id =
  e.target.dataset.id;

  const service =
  state.services.find(
    s => s.id === id
  );

  if(service){

    service.selected =
    e.target.checked;

    updateTotal();

    saveState();

  }

}

}
);

/* =========================
EDIT & DELETE
========================= */

servicesList.addEventListener(
"click",
(e)=>{

const editBtn =
e.target.closest("[data-edit]");

const deleteBtn =
e.target.closest("[data-delete]");

/* EDIT */

if(editBtn){

  const id =
  editBtn.dataset.edit;

  const service =
  state.services.find(
    s => s.id === id
  );

  if(!service) return;

  const newName =
  prompt(
    "نام خدمت:",
    service.name
  );

  if(newName === null)
  return;

  const newPrice =
  prompt(
    "قیمت (تومان):",
    service.price
  );

  if(newPrice === null)
  return;

  const price =
  Number(newPrice);

  if(
    !newName.trim()
    ||
    isNaN(price)
  ){

    alert(
      "اطلاعات نامعتبر است"
    );

    return;

  }

  service.name =
  newName.trim();

  service.price =
  price;

  render();

}

/* DELETE */

if(deleteBtn){

  const id =
  deleteBtn.dataset.delete;

  const service =
  state.services.find(
    s => s.id === id
  );

  if(!service) return;

  if(
    confirm(
      `حذف "${service.name}" ؟`
    )
  ){

    state.services =
    state.services.filter(
      s => s.id !== id
    );

    render();

  }

}

}
);

/* =========================
ADD SERVICE
========================= */

addServiceBtn.addEventListener(
"click",
()=>{

const name =
newServiceNameInput.value.trim();

const price =
Number(
  newServicePriceInput.value
);

if(
  !name ||
  isNaN(price) ||
  price <= 0
){

  alert(
    "نام و قیمت معتبر وارد کنید"
  );

  return;

}

state.services.push({

  id:
  crypto.randomUUID(),

  name,

  price,

  selected:false

});

newServiceNameInput.value = "";
newServicePriceInput.value = "";

render();

}
);

/* =========================
CUSTOMER NAME
========================= */

customerNameInput.addEventListener(
"input",
()=>{

state.customerName =
customerNameInput.value;

saveState();

updateTotal();

}
);

/* =========================
HISTORY RENDER
========================= */

function renderHistory(filter = "") {

const history =
loadHistory();

historyList.innerHTML = "";

const filtered =
history.filter(invoice =>

invoice.customer
.toLowerCase()
.includes(
  filter.toLowerCase()
)

);

filtered.reverse().forEach(
invoice => {

  const item =
  document.createElement("div");

  item.className =
  "history-item";

  item.innerHTML = `

  <div class="history-info">

    <div>

      <div class="history-customer">

        ${invoice.customer || "-"}

      </div>

      <div class="history-date">

        ${invoice.date}
        |
        ${invoice.time}

      </div>

    </div>

    <div class="history-total">

      ${formatMoney(invoice.total)}
      تومان

    </div>

  </div>

  <div class="history-actions">

    <button
      class="view-btn"
      onclick="viewInvoice('${invoice.id}')">

      مشاهده

    </button>

    <button
      class="load-btn"
      onclick="loadInvoice('${invoice.id}')">

      بارگذاری

    </button>

    <button
      class="delete-btn"
      onclick="deleteInvoice('${invoice.id}')">

      حذف

    </button>

  </div>

  `;

  historyList.appendChild(item);

});

}

/* =========================
SAVE INVOICE
========================= */

saveInvoiceBtn.addEventListener(
"click",
()=>{

const selected =
getSelectedServices();

if(selected.length === 0){

  alert(
    "حداقل یک خدمت انتخاب کنید"
  );

  return;

}

const history =
loadHistory();

history.push({

  id:
  crypto.randomUUID(),

  customer:
  state.customerName,

  date:
  getTodayPersian(),

  time:
  getCurrentTimePersian(),

  total:
  getTotal(),

  services:
  JSON.parse(
    JSON.stringify(selected)
  )

});

saveHistory(history);

renderHistory();

alert(
  "فاکتور ذخیره شد"
);

}
);

/* =========================
VIEW INVOICE
========================= */

window.viewInvoice =
function(id){

const history =
loadHistory();

const invoice =
history.find(
x => x.id === id
);

if(!invoice) return;

let text = "";

text +=
"مشتری: ${invoice.customer}\n\n";

text +=
"تاریخ: ${invoice.date}\n";

text +=
"ساعت: ${invoice.time}\n\n";

invoice.services.forEach(
(s,index)=>{

  text +=
  `${index+1}. ${s.name}

- ${formatMoney(s.price)}
  تومان\n`;
  
  }
  );

text +=
"\nمجموع: ${formatMoney(invoice.total)} تومان";

alert(text);

};

/* =========================
LOAD INVOICE
========================= */

window.loadInvoice =
function(id){

const history =
loadHistory();

const invoice =
history.find(
x => x.id === id
);

if(!invoice) return;

state.customerName =
invoice.customer;

state.services.forEach(
service => {

  service.selected = false;

  invoice.services.forEach(
    selected => {

      if(
        selected.name ===
        service.name
      ){

        service.selected =
        true;

      }

    }
  );

}

);

render();

alert(
"فاکتور بارگذاری شد"
);

};

/* =========================
DELETE INVOICE
========================= */

window.deleteInvoice =
function(id){

if(
!confirm(
"فاکتور حذف شود؟"
)
){
return;
}

let history =
loadHistory();

history =
history.filter(
item => item.id !== id
);

saveHistory(history);

renderHistory();

};

/* =========================
SEARCH
========================= */

searchInvoice.addEventListener(
"input",
()=>{

renderHistory(
  searchInvoice.value
);

}
);

/* =========================
RESET
========================= */

resetBtn.addEventListener(
"click",
()=>{

if(
  !confirm(
  "فاکتور جدید ایجاد شود؟"
  )
){
  return;
}

state.customerName = "";

state.date =
getTodayPersian();

state.time =
getCurrentTimePersian();

state.services.forEach(
  service => {

    service.selected =
    false;

  }
);

render();

}
);

/* =========================
SMS
========================= */

smsBtn.addEventListener(
"click",
async ()=>{

const text =
buildSmsText();

smsText.value =
text;

try{

  await navigator
  .clipboard
  .writeText(text);

  alert(
    "متن پیامک کپی شد"
  );

}catch{

  smsText.select();

  document.execCommand(
    "copy"
  );

  alert(
    "متن پیامک کپی شد"
  );

}

}
);

/* =========================
CLOCK
========================= */

setInterval(()=>{

currentTime.textContent =
getCurrentTimePersian();

},1000);

/* =========================
START
========================= */

render();

renderHistory();

currentDate.textContent =
getTodayPersian();

currentTime.textContent =
getCurrentTimePersian();
