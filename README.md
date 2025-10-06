# 💡 Aplicação Orientada a Eventos — Demo em Sala

Este projeto foi desenvolvido para **demonstração em aula** do paradigma **Orientado a Eventos** (Event-Driven Programming).  
A aplicação simula um sistema simples de **venda de ingressos** com reservas temporárias, utilizando **Node.js + Express + Socket.IO** para comunicação em tempo real.

---

## 🎯 Objetivos didáticos

- Compreender o **modelo orientado a eventos** em aplicações web.
- Explorar o uso de **eventos (`emit` e `on`)** entre **cliente** e **servidor**.
- Aplicar **sincronização em tempo real** entre múltiplos usuários.
- Entender **fluxos assíncronos com temporizadores e callbacks**.
- Demonstrar **consistência de estado compartilhado** entre clientes conectados.

---

## 🧠 Conceito: Paradigma Orientado a Eventos

No paradigma orientado a eventos:
- o **fluxo do programa** é determinado por **eventos** (ações do usuário, mensagens, temporizadores, notificações de rede, etc.);
- o sistema **reage** a esses eventos com **funções de callback**;
- o modelo é amplamente usado em interfaces gráficas, servidores web e sistemas de tempo real.

📘 Exemplo prático neste projeto:
1. O administrador **inicia** o sistema (`admin.start`).
2. O cliente **reserva** ingressos (`client.reserve`).
3. O servidor **confirma** ou **expira** a reserva (`reservation.confirmed` / `reservation.expired`).
4. O cliente **compra** ou **cancela** a reserva (`client.purchase` / `client.cancel`).
5. O servidor **sincroniza o estado global** com todos os clientes (`system.sync`).

---

## ⚙️ Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- HTML5 + JavaScript (frontend)
- Paradigma: **Event-Driven**

---

## 🧩 Estrutura do projeto

