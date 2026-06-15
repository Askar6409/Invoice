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
MONEY
========================= */

function formatMoney(value) {

return Number(value || 0)
.toLocaleString("fa-IR");

}

/* =========================
DEFAULT SERVICES
(تومان)
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
LOCAL STORAGE
========================= */

function loadState() {

const saved =
localStorage.getItem(STORAGE_KEY);

if(saved){

const data = JSON.parse(saved);

data.date = getTodayPersian();
data.time = getCurrentTimePersian();

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
localStorage.getItem(HISTORY_KEY)
|| "[]"
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
SERVICES
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
SMS
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
"مشتری: ${state.customerName || "-"}\n";

text +=
"----------------------\n";

if(selected.length === 0){

text +=
"خدمتی انتخاب نشده است.\n";

}else{

selected.forEach(
  (service,index)=>{

  text +=
  `${index+1}. ${service.name}

- ${formatMoney(service.price)}
  تومان\n`;
  
  });

}

text +=
"----------------------\n";

text +=
"مجموع: ${formatMoney(getTotal())} تومان";

return text;

                 }
