# 📚 Swagger API Documentation - Prigione Records

## 🚀 Come Accedere a Swagger

Dopo aver avviato l'applicazione Spring Boot, puoi accedere alla documentazione interattiva Swagger attraverso i seguenti URL:

### 🌐 URL Principali

- **Swagger UI**: [http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/api/api-docs](http://localhost:8080/api/api-docs)

## 🔧 Come Avviare l'Applicazione

```bash
# Compila il progetto
mvn clean compile

# Avvia l'applicazione
mvn spring-boot:run
```

Oppure con il JAR:

```bash
# Compila e crea il JAR
mvn clean package

# Avvia il JAR
java -jar target/prigione-records-0.0.1-SNAPSHOT.jar
```

## 🔐 Autenticazione nelle API

### Step 1: Registrazione/Login
1. Utilizza l'endpoint `/api/auth/register` per registrare un nuovo utente
2. Oppure utilizza `/api/auth/login` per autenticare un utente esistente
3. Copia il `token` dalla risposta

### Step 2: Autenticazione in Swagger
1. Clicca sul pulsante **"Authorize"** 🔒 in alto a destra nella pagina Swagger
2. Inserisci il token nel campo come: `Bearer YOUR_TOKEN_HERE`
3. Clicca su **"Authorize"**

### Esempio di Token
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE2NDA5OTg4MDB9.abc123def456ghi789
```

## 📋 Endpoints Disponibili

### 🔐 Authentication
- `POST /api/auth/register` - Registra nuovo utente
- `POST /api/auth/login` - Login utente

### 🏢 Studi di Registrazione  
- `GET /api/studi` - Lista tutti gli studi
- `POST /api/studi` - Crea nuovo studio (ADMIN only)
- `GET /api/studi/{id}` - Dettagli studio
- `PUT /api/studi/{id}` - Aggiorna studio (ADMIN only)
- `DELETE /api/studi/{id}` - Elimina studio (ADMIN only)
- `GET /api/studi/{id}/disponibilita` - Verifica disponibilità

### 📅 Prenotazioni
- `GET /api/prenotazioni` - Lista tutte le prenotazioni
- `POST /api/prenotazioni` - Crea nuova prenotazione
- `GET /api/prenotazioni/studio/{studioId}` - Prenotazioni per studio
- `GET /api/prenotazioni/mie` - Le mie prenotazioni
- `DELETE /api/prenotazioni/{id}` - Elimina prenotazione

### ⭐ Recensioni
- `GET /api/recensioni` - Tutte le recensioni
- `POST /api/recensioni` - Crea nuova recensione
- `GET /api/recensioni/studio/{studioId}` - Recensioni per studio  
- `GET /api/recensioni/mie` - Le mie recensioni
- `DELETE /api/recensioni/{id}` - Elimina recensione

### 📊 Dashboard
- `GET /api/dashboard` - Dati statistici dashboard

## 💡 Tip Utili

### Testare l'API Step by Step:
1. **Registra un utente**: `POST /api/auth/register`
2. **Fai login**: `POST /api/auth/login` (copia il token)
3. **Autorizza in Swagger**: Clicca "Authorize" e inserisci il token
4. **Esplora gli endpoints**: Ora puoi testare tutte le API protette!

### Ruoli Utente:
- **USER**: Può creare prenotazioni e recensioni
- **ADMIN**: Può gestire gli studi di registrazione

### Formato Date:
Le date devono essere in formato `YYYY-MM-DD` (es: `2024-01-15`)

## 🛠 Troubleshooting

### Errore 401 Unauthorized:
- Verifica di aver inserito correttamente il token
- Controlla che il token non sia scaduto (24 ore)
- Assicurati di aver prefisso "Bearer " al token

### Errore 403 Forbidden:
- Controlla di avere i permessi necessari
- Operazioni ADMIN richiedono ruolo amministratore

### MongoDB Non Connesso:
- Verifica che MongoDB sia in esecuzione su localhost:27017
- Controlla la configurazione in `application.yml`

## 🎉 Divertiti a Testare!

Swagger è ora completamente configurato e pronto per testare tutti gli endpoint dell'API Prigione Records! 

Happy Testing! 🚀 