
# 💡 Aplicação Orientada a Eventos — Demo em Sala

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Socket.IO](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

> 🧠 Projeto de demonstração para ensino do **Paradigma Orientado a Eventos** utilizando **Node.js + Express + Socket.IO**.

## 🎯 Objetivos Didáticos
- Compreender o **modelo orientado a eventos** em aplicações web.
- Explorar o uso de **eventos (`emit` e `on`)** entre **cliente** e **servidor**.
- Aplicar **sincronização em tempo real** entre múltiplos usuários.
- Demonstrar **fluxos assíncronos com temporizadores e callbacks**.
- Entender **consistência de estado compartilhado** entre clientes conectados.

## 🧠 Paradigma Orientado a Eventos
No paradigma orientado a eventos:
- o **fluxo do programa** é determinado por **eventos** (ações, mensagens, notificações);
- o sistema **reage** a esses eventos com **funções de callback**;
- o modelo é amplamente usado em **interfaces gráficas**, **servidores web** e **sistemas de tempo real**.

### 📘 Exemplo prático neste projeto
1. O administrador **inicia o sistema** (`admin.start`).
2. O cliente **reserva ingressos** (`client.reserve`).
3. O servidor **confirma** ou **expira** a reserva (`reservation.confirmed` / `reservation.expired`).
4. O cliente **compra** ou **cancela** (`client.purchase` / `client.cancel`).
5. O servidor **sincroniza o estado global** (`system.sync`).

## ⚙️ Tecnologias Utilizadas
| Categoria | Ferramenta |
|------------|-------------|
| 🖥️ Runtime | [Node.js](https://nodejs.org/) |
| ⚙️ Framework | [Express](https://expressjs.com/) |
| 🔁 Comunicação em tempo real | [Socket.IO](https://socket.io/) |
| 💻 Frontend | HTML5 + JavaScript |
| 💡 Paradigma | Event-Driven Programming |

## 🧩 Estrutura do Projeto
```
event-driven-demo/
├── package.json
├── server.js
└── public/
    ├── index.html
    └── main.js
```

## 🚀 Como Executar
1️⃣ **Instalar dependências**
```bash
npm install
```
2️⃣ **Iniciar o servidor**
```bash
npm run dev
```
3️⃣ **Abrir no navegador**
```
http://localhost:3000
```
4️⃣ **Abrir duas abas diferentes**
- Aba 1 → clique em **Iniciar** (defina o total de itens)
- Aba 2 → clique em **Reservar** e observe o timer
- Veja o estado global sendo atualizado **em tempo real** ⚡

## 🔁 Fluxo de Eventos
| Tipo | Evento | Origem | Destino | Descrição |
|------|---------|---------|----------|------------|
| 🟢 Emissão | `admin.start` | Cliente (Admin) | Servidor | Inicia o sistema com total de ingressos |
| 🟢 Emissão | `client.reserve` | Cliente | Servidor | Solicita reserva temporária |
| 🔵 Resposta | `reservation.confirmed` | Servidor | Cliente | Confirma reserva e inicia timer |
| 🔵 Resposta | `reservation.expired` | Servidor | Cliente | Reserva expirada automaticamente |
| 🟢 Emissão | `client.purchase` | Cliente | Servidor | Confirma compra |
| 🔵 Resposta | `purchase.confirmed` | Servidor | Cliente | Compra concluída |
| 🟣 Broadcast | `system.sync` | Servidor | Todos | Atualiza estado global |
| 🟣 Broadcast | `system.ended` | Servidor | Todos | Sistema encerrado |
| 🟢 Emissão | `client.cancel` | Cliente | Servidor | Cancela reserva manualmente |

## 🧪 Roteiro de Aula (Sugestão)
1. Introdução teórica — explicar o paradigma orientado a eventos.
2. Mostrar o código do servidor — `io.on("connection")` e `socket.on("client.reserve")`.
3. Executar a demo ao vivo:
   - abrir 2 abas e demonstrar sincronização;
   - fazer uma reserva e deixar expirar;
   - efetuar uma compra e mostrar o broadcast.
4. Discutir vantagens: reatividade, escalabilidade e consistência.
5. Propor o trabalho prático: cada aluno cria uma variação temática com novos eventos.

## 🧱 Sugestão para os Alunos
Cada aluno deve:
- Criar uma **variação de tema** (ex.: cinema, estacionamento, votação, delivery).
- Alterar os **nomes dos eventos** (`assento.reservado`, `vaga.ocupada`, `pedido.realizado`).
- Adicionar **um novo evento original** do contexto.
- Entregar com README explicando o fluxo e os eventos criados.

## 🧩 Exemplo de Fluxo Visual
```
admin.start → client.reserve → reservation.confirmed
      ↓              ↓                 ↓
 system.sync   reservation.expired   client.purchase
```

## 👨‍🏫 Créditos
**Professor:** Ademar Perfoll Junior  
**Disciplina:** Linguagens de Programação e Paradigmas  
**Instituição:** UNIDAVI  
**Ano:** 2025  

> 💬 _"Em um sistema orientado a eventos, não controlamos o fluxo do tempo — apenas reagimos a ele."_

## 🌍 English Summary (for GitHub visitors)
This is a **classroom demo** for teaching the **Event-Driven Programming paradigm**, using **Node.js, Express, and Socket.IO** to simulate a simple ticket reservation system.  
Students can easily adapt the base code to their own **context-based projects** (cinema, voting, parking, etc.), focusing on mastering the use of `emit` / `on` events and state synchronization in real time.

### ⭐️ Show some support!
If you find this project useful, give it a ⭐️ on GitHub and share it with your classmates or colleagues!  
Happy coding 👨‍💻👩‍💻
