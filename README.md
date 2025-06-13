# 🪨 StoneTrader

Moderní open-source trading platforma pro CTID (Pepperstone), postavená na React + Express, rozšiřitelná o vlastní pluginy.

## Spuštění
1. Spusť backend: `node backend/src/index.js`
2. Spusť frontend: `npm start` ve složce frontend/
3. Otevři v prohlížeči [http://localhost:3000](http://localhost:3000)

## Struktura
- `frontend/src/components/` – React komponenty (UI)
- `frontend/src/services/` – API, websockety, constants
- `frontend/src/plugins/` – uživatelské indikátory a alerty
- `backend/src/services/` – napojení na CTID API
- Ostatní viz TODO.md a architektonický prompt

## TODO & DEVLOG
Aktuální rozpracovanost, roadmapu a logy najdeš v TODO.md a DEVLOG.md.
