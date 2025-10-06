// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

// habilita "type": "module" no package.json ou troque para require(...)
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

/**
 * Estado global simples:
 * started  -> sistema começou?
 * total    -> total de itens (ex.: ingressos)
 * available-> disponível para reservar
 * reserved -> temporariamente reservado
 * sold     -> vendido (após compra)
 */
const state = { started: false, total: 0, available: 0, reserved: 0, sold: 0 };

/** reservas ativas por socket.id */
const holds = new Map(); // socketId -> { qty, expiresAt, timer }

/** envia um "snapshot" do estado para todos */
function syncAll() {
  io.emit("system.sync", { ...state });
}

/** encerra automaticamente quando não há mais nada a vender/reservar */
function endIfFinished() {
  if (state.started && state.available === 0 && state.reserved === 0) {
    io.emit("system.ended", { sold: state.sold, total: state.total });
  }
}

io.on("connection", (socket) => {
  console.log("Conectou:", socket.id);

  // cada novo cliente recebe o estado atual
  socket.emit("system.sync", { ...state });

  /** ADMIN: iniciar o sistema com um total de itens */
  socket.on("admin.start", ({ total }) => {
    const t = Number(total);
    if (!Number.isFinite(t) || t <= 0) {
      return socket.emit("error.msg", { msg: "Total inválido." });
    }

    // limpa todas as reservas anteriores (se houver)
    for (const [, hold] of holds.entries()) {
      clearTimeout(hold.timer);
    }
    holds.clear();

    state.started = true;
    state.total = t;
    state.available = t;
    state.reserved = 0;
    state.sold = 0;

    io.emit("system.started", { total: t });
    syncAll();
  });

  /** CLIENTE: solicitar reserva com tempo (segundos) */
  socket.on("client.reserve", ({ qty = 1, seconds = 20 }) => {
    if (!state.started) return socket.emit("error.msg", { msg: "Sistema não iniciado." });

    const q = Math.max(1, Math.min(10, Number(qty) || 1));       // limita 1..10
    const s = Math.max(5, Math.min(120, Number(seconds) || 20)); // limita 5..120s

    if (holds.has(socket.id)) {
      return socket.emit("error.msg", { msg: "Você já possui uma reserva ativa." });
    }
    if (state.available < q) {
      return socket.emit("error.msg", { msg: "Quantidade indisponível." });
    }

    // aplica a reserva
    state.available -= q;
    state.reserved += q;
    const expiresAt = Date.now() + s * 1000;

    const timer = setTimeout(() => {
      const h = holds.get(socket.id);
      if (!h) return;
      state.reserved -= h.qty;
      state.available += h.qty;
      holds.delete(socket.id);
      io.to(socket.id).emit("reservation.expired", { qty: h.qty });
      syncAll();
    }, s * 1000);

    holds.set(socket.id, { qty: q, expiresAt, timer });
    socket.emit("reservation.confirmed", { qty: q, expiresAt }); // feedback só para o reservante
    syncAll(); // todos veem o impacto no estoque
  });

  /** CLIENTE: confirmar compra (consome a reserva) */
  socket.on("client.purchase", () => {
    if (!state.started) return socket.emit("error.msg", { msg: "Sistema não iniciado." });
    const hold = holds.get(socket.id);
    if (!hold) return socket.emit("error.msg", { msg: "Nenhuma reserva ativa." });

    clearTimeout(hold.timer);
    holds.delete(socket.id);

    state.reserved -= hold.qty;
    state.sold += hold.qty;

    socket.emit("purchase.confirmed", { qty: hold.qty }); // confirma ao comprador
    io.emit("system.updated", { sold: state.sold });      // ticker simples p/ todos
    syncAll();
    endIfFinished();
  });

  /** CLIENTE: cancelar manualmente a reserva */
  socket.on("client.cancel", () => {
    const hold = holds.get(socket.id);
    if (!hold) return;
    clearTimeout(hold.timer);
    holds.delete(socket.id);
    state.reserved -= hold.qty;
    state.available += hold.qty;
    socket.emit("reservation.canceled", { qty: hold.qty });
    syncAll();
  });

  /** desconexão: devolve a reserva (se existir) */
  socket.on("disconnect", () => {
    const hold = holds.get(socket.id);
    if (hold) {
      clearTimeout(hold.timer);
      holds.delete(socket.id);
      state.reserved -= hold.qty;
      state.available += hold.qty;
      syncAll();
    }
    console.log("Saiu:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  console.log("Demo: Paradigma Orientado a Eventos (Socket.IO).");
});
