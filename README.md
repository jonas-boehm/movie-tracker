# 🎜️ MovieTracker

**MovieTracker** ist eine Full-Stack Webanwendung zum Durchsuchen, Filtern und Bewerten von Filmen. Angemeldete Benutzer können Filme mit 0–5 Sternen bewerten – in Echtzeit per WebSocket! Die Bewertungen werden gespeichert und automatisch allen anderen Benutzern angezeigt.

---

## 🚀 Features

* 🔎 Filmsuche über die TMDB API
* 🎞️ Filterbar nach Genre, Jahr und Bewertung
* ⭐ Benutzerbewertungen mit 0–5 Sternen
* 🧠 Bewertung wird in Echtzeit via WebSocket aktualisiert
* 🗃️ Alle Bewertungen werden dauerhaft in PostgreSQL gespeichert
* 👤 Einfaches Login/Registrieren mit Benutzernamen + Passwort
* 🛣️ Vollständig Dockerisiert (Datenbank + Backend)

---

## 🛠️ Technologien

* **Frontend:** Angular Standalone Components + Bootstrap
* **Backend:** Node.js + Express
* **Datenbank:** PostgreSQL
* **WebSocket:** `ws`-Modul
* **API:** TMDB API für Filmdaten
* **Containerisierung:** Docker + Docker Compose

---

## ▶️ Projekt ausführen

### Voraussetzungen

* Docker & Docker Compose installiert
* `.env`-Datei im Backend mit gültigem TMDB API Key:

  ```env
  TMDB_API_KEY=dein_api_key
  ```

---

### 🔧 Projekt starten (mit Docker Compose)

```bash
git clone https://git.htl-hl.ac.at/dein-nutzername/movie-tracker.git
cd movie-tracker

# Starte alle Container: Datenbank + Backend
docker-compose up --build
```

---

### 🌐 Zugriff

| Komponente             | URL                                                    |
| ---------------------- | ------------------------------------------------------ |
| Frontend (Angular)     | [http://localhost:4200](http://localhost:4200)         |
| Backend (Express)      | [http://localhost:3000/api](http://localhost:3000/api) |
| Datenbank (PostgreSQL) | läuft intern auf Port 5432     
| Appp über Docker       | http://localhost:3000

---

## 🧪 Testdatenbankzugriff

Um in den PostgreSQL-Container zu gelangen:

```bash
docker exec -it movie-tracker-db-1 psql -U postgres -d movietracker
```
