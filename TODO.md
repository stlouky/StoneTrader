# 🪨 StoneTrader – TODO & Roadmap

Tento soubor obsahuje podrobný plán pro vytvoření první plně spustitelné verze (MVP).  
Odškrtávej si splněné úkoly a v případě potřeby přidávej nové body.  
Detailní denní průběh piš do DEVLOG.md.

---

## Milestone: MVP (První spustitelná verze)

### 1. Backend (Node.js + Express)
- [ ] Inicializace npm a instalace závislostí (express, ws, cors, morgan)
- [ ] Základní Express server v `src/index.js`, endpoint `/status`
- [ ] Middleware: CORS, logger
- [ ] WebSocket server: stream dummy candle dat (každou sekundu)
- [ ] Služby & routy: 
  - [ ] Prázdný `services/ctidConnector.js` 
  - [ ] `routes/account.js` (GET /account, mock data)
  - [ ] `routes/orders.js` (POST /order, mock ack)

### 2. Frontend (React + lightweight-charts)
- [ ] Inicializace projektu (vite/cra), přidání TailwindCSS, lightweight-charts
- [ ] Základní layout v `App.jsx` – hlavní graf, sidebary
- [ ] Komponenty: `Chart.jsx`, `SidebarLeft.jsx`, `SidebarRight.jsx`, `AlertCenter.jsx`, `Settings.jsx`
- [ ] Hooky: `useWebSocket.js`, `useAPI.js`
- [ ] Graf: `Chart.jsx` zobrazí candlestick graf (data přes WS)
- [ ] Komunikace: 
  - [ ] `services/api.js` pro REST
  - [ ] `services/ws.js` pro websocket
- [ ] Pluginy: 
  - [ ] Složka `plugins/`
  - [ ] Dummy “hello world” plugin

### 3. Docker Compose a spuštění
- [ ] Základní `docker-compose.yml` – dva kontejnery: backend a frontend
- [ ] Spuštění: `docker-compose up`
- [ ] Ověřit běh, popsat v TODO/README

### 4. První funkční test (spustitelnost MVP)
- [ ] Backend: `node backend/src/index.js` nebo docker
- [ ] Frontend: `npm start` nebo docker
- [ ] Ověřit: 
    - [ ] Graf běží a “hýbe se” (dummy data)
    - [ ] REST endpointy `/status`, `/account` odpovídají

### 5. První commit – “MVP is running”
- [ ] Commit všech souborů s message „MVP is running“
- [ ] Aktualizovat TODO.md, DEVLOG.md, README.md s návodem k běhu

---

Pozn.: Každou změnu, úspěch nebo slepou uličku pečlivě zapiš do DEVLOG.md (datum, krok, výsledek).
