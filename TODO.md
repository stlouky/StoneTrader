# 🪨 StoneTrader – Architektura a postup vývoje

**Cíl:**  
Vytvořit modulární, čistou a bezpečnou obchodní platformu v duchu TradingView, navrženou primárně pro jednoho uživatele (mně), s rozšiřitelným systémem pluginů a maximální efektivitou pro reálné obchodování přes CTID (Pepperstone).  
Projekt je **verzovaný na GitHubu** kvůli zálohám a přenositelnosti mezi stroji/systémy.

---

## Hlavní architektura (shrnutí)
### Stack
- Frontend: React (modulární komponenty, dark mode, čistý styl s Tailwindem)
- Backend: Node.js + Express (API proxy, websocket data, bezpečné uložení klíčů)
- Plugin systém: JavaScript moduly, které mají přístup k datům grafu, mohou kreslit, alertovat, zadávat příkazy
- Data: WebSocket pro tick/candle feed, REST API pro správu účtu, orderů, pluginů
- Deployment: Docker Compose (frontend + backend), snadno portovatelné mezi Linux instalacemi a VPS/cloudem
- Repozitář: GitHub (celá struktura + komentáře, návod pro každý krok)

---

## Struktura projektu

/StoneTrader
├─ frontend/
│   ├─ public/
│   └─ src/
│       ├─ components/
│       │   ├─ Chart.jsx
│       │   ├─ SidebarLeft.jsx     // pluginy/indikátory
│       │   ├─ SidebarRight.jsx    // order panel, P/L kotva
│       │   ├─ AlertCenter.jsx
│       │   └─ Settings.jsx
│       ├─ plugins/                // uživatelské JS pluginy
│       ├─ services/
│       │   ├─ api.js              // komunikace REST/WebSocket s backendem
│       └─ App.jsx
│       └─ index.jsx
├─ backend/
│   ├─ src/
│   │   ├─ index.js                // Express + WebSocket
│   │   ├─ routes/
│   │   │   ├─ account.js
│   │   │   └─ orders.js
│   │   ├─ services/
│   │   │   └─ ctidConnector.js
│   │   └─ pluginEngine.js
│   ├─ config/
│   │   └─ default.json
│   └─ package.json
└─ docker-compose.yml

---

## Postup práce (workflow, krok za krokem)

### 1. Backend – základní server a připojení k CTID
1. backend/src/index.js  
   - Vytvořit základní Express server, zprovoznit Hello World endpoint /status
2. backend/src/services/ctidConnector.js  
   - Napojit Pepperstone CTID API (autentizace, získání základních dat o účtu)
   - Otestovat API volání (fetch account info, fetch positions)
3. backend/src/routes/account.js, backend/src/routes/orders.js  
   - Přidat routy pro získání pozic, zadávání objednávek
   - Otestovat volání napřímo (curl/Postman)

### 2. Frontend – základ a graf
4. frontend/src/App.jsx  
   - Vytvořit základní layout (stránka s levým, pravým panelem, centrální graf)
5. frontend/src/components/Chart.jsx  
   - Zaintegrovat lightweight-charts, zobrazit candlestick z demo dat
6. frontend/src/services/api.js  
   - Napsat funkce pro volání backendu (fetch account, fetch candles, send order)

### 3. WebSocket komunikace
7. backend/src/index.js (rozšířit)  
   - Přidat websocket server, broadcast tick/candle data na frontend
8. frontend/src/services/ws.js  
   - Napojit websocket, zobrazit live ticky v grafu

### 4. Plugin systém
9. backend/src/pluginEngine.js  
   - Loader a executor pluginů – načítat JS moduly z /plugins/, volat onTick() při každém novém ticku/candle
10. frontend/src/plugins/  
    - Přidat vzorový plugin (EMA alert, volume spike)  
    - Nastavit UI pro výběr/zapnutí/vypnutí pluginu  
    - Zobrazit alert/akci v AlertCenter komponentě

### 5. Order panel, alerty a konfigurace
11. frontend/src/components/SidebarRight.jsx (Order Panel + P/L)  
    - UI pro market/limit vstupy, přehled otevřených pozic
12. frontend/src/components/AlertCenter.jsx  
    - Log alertů, možnost kliknutím potvrdit/exekuovat obchod (nebo auto-exekuce)
13. frontend/src/components/Settings.jsx  
    - Stránka pro nastavení (API klíče – ukládat na backend, nenahrávat do Gitu!)
    - Nastavení pluginů, vzhledu

### 6. Docker Compose a deployment
14. docker-compose.yml  
    - Setup pro snadné spuštění (frontend build + backend + reverse proxy)
15. Testování:  
    - Ověřit běh na lokálu, následně přesun na VPS nebo cloud

---

## Doporučení k verzování a rozšiřování
- Každý větší krok/commit musí být samostatně funkční (nepřeskakuj, ať máš vždy co spustit)
- Vše testuj nejprve na mock datech, až potom na živém účtu!
- Každý plugin popisuj v komentáři i README (parametry, jak funguje, co dělá)
- Citlivé údaje (API klíče) nikdy nedávej do Gitu – vždy v .env nebo do backend configu
- Pokud budeš potřebovat experimentální branch (např. nová strategie, UI změna) – forkuj a testuj odděleně

---

### Shrnutí
- StoneTrader je rozšiřitelná a bezpečná platforma na trading, postavená na moderním open-source stacku, designovaná pro jediného power-usera.
- Vývoj probíhá po jednotlivých krocích, každý commit musí být logický a přehledný (viz workflow výše).
- GitHub je hlavní místo pro kód, zálohu a dokumentaci.

---
