# MovieTracker

MovieTracker ist eine Full-Stack Webanwendung zum Verwalten, Durchsuchen und Bewerten von Filmen. Sie verwendet Angular im Frontend und Express.js mit PostgreSQL im Backend. Nutzer können sich registrieren, anmelden, Filme durchsuchen, filtern und eigene Bewertungen abgeben. Bewertungen werden in Echtzeit über WebSockets aktualisiert.

## Technologien

* **Frontend**: Angular mit Bootstrap
* **Backend**: Node.js, Express
* **Datenbank**: PostgreSQL
* **Echtzeit**: WebSockets (ws)
* **API-Dokumentation**: Swagger (OpenAPI)
* **Containerisierung**: Docker, Docker Compose

## Voraussetzungen (bei lokaler Ausführung ohne Docker)

* Node.js und npm installiert
* PostgreSQL installiert (alternativ über Docker)

## Projekt lokal starten (ohne Docker)

### Backend:

```bash
cd backend
npm install
npm run dev
```

### Frontend:

```bash
cd frontend
npm install
ng serve --open
```

### Datenbank initialisieren (nur beim ersten Start)

PostgreSQL-Datenbank anlegen und SQL-Datei aus `db/init/init.sql` ausführen:

```sql
CREATE DATABASE movietracker;
-- Danach Inhalt von init.sql importieren
```

## Projekt starten über Docker

Stelle sicher, dass Docker und Docker Compose installiert sind.

### Schritte:

```bash
docker compose up --build
```

### Ergebnis:

* Das Backend ist unter `http://localhost:3000` erreichbar
* Swagger UI ist unter `http://localhost:3000/api-docs` erreichbar
* Angular-Frontend ist unter `http://localhost:3000` eingebunden

## Swagger API-Dokumentation

Alle REST-Endpoints sind automatisch dokumentiert mit Swagger.

Rufe dazu im Browser auf:

```
http://localhost:3000/api-docs
```

## Datenbank-Zugriff (Docker)

Standard-Zugangsdaten für PostgreSQL:

* Host: `localhost`
* Port: `5432`
* Datenbank: `movietracker`
* Benutzer: `postgres`
* Passwort: `postgres`

## Projektstruktur (Auszug)

```
movie-tracker/
├── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── websocket.js
│   └── index.js
├── frontend/
│   └── src/app/
├── db/init/init.sql
├── docker-compose.yml
└── README.md
```


