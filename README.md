# PrigioneRecords

Applicazione backend in Java (Spring Boot) per la gestione di studi di registrazione, prenotazioni e recensioni.

## 🎯 Funzionalità

### Autenticazione e Sicurezza
- Registrazione utenti (cantanti)
- Login con JWT
- Protezione degli endpoint con Spring Security
- Gestione ruoli e autorizzazioni

### Gestione Studi di Registrazione
- CRUD operazioni per studi di registrazione
- Visualizzazione dettagli studio
- Calcolo e aggiornamento media recensioni

### Prenotazioni
- Creazione prenotazioni per studi di registrazione
- Verifica disponibilità studio
- Prevenzione prenotazioni duplicate
- Validazione date prenotazione

### Recensioni
- Creazione recensioni per studi
- Prevenzione recensioni duplicate
- Calcolo automatico media recensioni
- Gestione commenti e valutazioni

### Dashboard Utente
- Visualizzazione prenotazioni personali
- Storico recensioni
- Statistiche utente

## 🛠️ Tecnologie Utilizzate

- Java 17
- Spring Boot 3.1.5
- Spring Security
- JWT per autenticazione
- MongoDB per la persistenza dei dati
- Maven per la gestione delle dipendenze
- SpringDoc OpenAPI 3 per documentazione API

## 📋 Prerequisiti

- JDK 17 o superiore
- MongoDB
- Maven

## 🚀 Installazione e Avvio

1. Clona il repository
2. Configura MongoDB (host, porta e database in `application.yml`)
3. Esegui il build del progetto:
   ```bash
   mvn clean install
   ```
4. Avvia l'applicazione:
   ```bash
   mvn spring-boot:run
   ```

L'applicazione sarà disponibile su `http://localhost:8080/api`

## 📚 Documentazione API (Swagger)

Una volta avviata l'applicazione, puoi accedere alla documentazione interattiva delle API tramite Swagger UI:

**🔗 [http://localhost:8080/api/swagger-ui/index.html](http://localhost:8080/api/swagger-ui/index.html)**

La documentazione include:
- Tutti gli endpoint disponibili
- Schemi di richiesta e risposta
- Possibilità di testare le API direttamente dall'interfaccia
- Esempi di utilizzo
- Informazioni sui codici di stato HTTP

## 🔑 Configurazione

Modifica il file `application.yml` per configurare:
- Porta del server
- Connessione MongoDB
- Chiave segreta JWT
- Durata token JWT

## 🔒 Sicurezza

- Tutti gli endpoint (eccetto /api/auth/** e documentazione) richiedono autenticazione
- Token JWT per gestione sessioni
- Password criptate con BCrypt
- Validazione input

## 📝 API Endpoints

### Autenticazione
- POST `/api/auth/register` - Registrazione nuovo cantante
- POST `/api/auth/login` - Login cantante

### Studi di Registrazione
- GET `/api/studi` - Lista studi
- GET `/api/studi/{id}` - Dettagli studio
- POST `/api/studi` - Crea studio (admin)
- PUT `/api/studi/{id}` - Modifica studio (admin)
- DELETE `/api/studi/{id}` - Elimina studio (admin)

### Prenotazioni
- POST `/api/prenotazioni` - Crea prenotazione
- GET `/api/prenotazioni` - Lista prenotazioni
- GET `/api/prenotazioni/mie` - Prenotazioni personali
- DELETE `/api/prenotazioni/{id}` - Cancella prenotazione

### Recensioni
- POST `/api/recensioni` - Crea recensione
- GET `/api/recensioni/studio/{id}` - Recensioni studio
- GET `/api/recensioni/mie` - Recensioni personali

### Dashboard
- GET `/api/dashboard` - Dati dashboard utente

## 👥 Autori

- Francesco Devillanova
- Davide Galliani
- Francesco Bonavita

## 📄 Licenza

Questo progetto è sotto licenza MIT.