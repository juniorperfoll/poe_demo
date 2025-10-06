// public/main.js
const socket = io();

// elementos de UI
const totalInput = document.getElementById("total");
const btnStart = document.getElementById("btnStart");

const qtyInput = document.getElementById("qty");
const secondsInput = document.getElementById("seconds");
const btnReserve = document.getElementById("btnReserve");
const btnPurchase = document.getElementById("btnPurchase");
const btnCancel = document.getElementById("btnCancel");

const startedEl = document.getElementById("started");
const totalEl = document.getElementById("totalS");
const availableEl = document.getElementById("available");
const reservedEl = document.getElementById("reserved");
const soldEl = document.getElementById("sold");
const statusEl = document.getElementById("status");

const myHoldEl = document.getElementById("myHold");
const countdownEl = document.getElementById("countdown");
const msgEl = document.getElementById("msg");

let myExpiresAt = null;
let countdownTimer = null;

function setMessage(text, type="muted") {
  msgEl.textContent = text || "";
  const map = { ok: "#0a7", warn: "#c60", err: "#c00", muted: "#666" };
  msgEl.style.color = map[type] || "#666";
}

function renderState(s) {
  startedEl.textContent = String(s.started);
  totalEl.textContent = s.total;
  availableEl.textContent = s.available;
  reservedEl.textContent = s.reserved;
  soldEl.textContent = s.sold;
  statusEl.textContent = (s.available === 0 && s.reserved === 0) ? "Esgotado." : "";
}

function startCountdown(expiresAt) {
  clearInterval(countdownTimer);
  if (!expiresAt) { countdownEl.textContent = "–"; return; }
  countdownTimer = setInterval(() => {
    const remain = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    countdownEl.textContent = remain + "s";
    if (remain <= 0) clearInterval(countdownTimer);
  }, 200);
}

// EMIT (cliente → servidor)
btnStart.addEventListener("click", () => {
  socket.emit("admin.start", { total: Number(totalInput.value) || 10 });
});
btnReserve.addEventListener("click", () => {
  socket.emit("client.reserve", {
    qty: Number(qtyInput.value) || 1,
    seconds: Number(secondsInput.value) || 20
  });
});
btnPurchase.addEventListener("click", () => {
  socket.emit("client.purchase");
});
btnCancel.addEventListener("click", () => {
  socket.emit("client.cancel");
});

// ON (servidor → cliente)
socket.on("system.sync", renderState);
socket.on("system.started", ({ total }) => setMessage(`Sistema iniciado com total ${total}.`, "ok"));
socket.on("system.updated", ({ sold }) => setMessage(`Venda confirmada! Vendidos: ${sold}.`, "ok"));
socket.on("system.ended", ({ sold, total }) => setMessage(`Encerrado. Vendidos: ${sold}/${total}.`, "warn"));

socket.on("reservation.confirmed", ({ qty, expiresAt }) => {
  myHoldEl.textContent = `${qty} item(ns)`;
  myExpiresAt = expiresAt;
  startCountdown(expiresAt);
  setMessage("Reserva criada. Conclua a compra antes do tempo expirar.", "ok");
});

socket.on("reservation.expired", () => {
  myExpiresAt = null;
  myHoldEl.textContent = "nenhuma";
  startCountdown(null);
  setMessage("Sua reserva expirou.", "warn");
});

socket.on("reservation.canceled", () => {
  myExpiresAt = null;
  myHoldEl.textContent = "nenhuma";
  startCountdown(null);
  setMessage("Reserva cancelada.", "warn");
});

socket.on("purchase.confirmed", () => {
  myExpiresAt = null;
  myHoldEl.textContent = "nenhuma";
  startCountdown(null);
  setMessage("Compra confirmada!", "ok");
});

socket.on("error.msg", ({ msg }) => setMessage(msg, "err"));
