# PrigioneRecords 🎵

Una moderna applicazione full-stack per la gestione di studi di registrazione, prenotazioni e recensioni. Il progetto combina un backend robusto in Java Spring Boot con un frontend responsive in HTML/CSS/JavaScript.

## 🌟 Caratteristiche Principali

- 🔐 **Autenticazione JWT** - Sistema sicuro di login e registrazione
- 🏢 **Gestione Studi** - CRUD completo per studi di registrazione
- 📅 **Sistema di Prenotazioni** - Prenotazione studi con controllo disponibilità
- ⭐ **Recensioni e Valutazioni** - Sistema di feedback con calcolo automatico delle medie
- 📊 **Dashboard Utente** - Panoramica personalizzata delle attività
- 🎨 **UI Moderna** - Frontend responsive e intuitivo
- 🐳 **Docker Ready** - Setup semplificato con Docker Compose

## 🛠️ Stack Tecnologico

### Backend
- **Java 17** - Linguaggio di programmazione
- **Spring Boot 3.1.5** - Framework principale
- **Spring Security** - Sicurezza e autenticazione
- **JWT** - Token-based authentication
- **MongoDB** - Database NoSQL
- **Maven** - Gestione dipendenze
- **SpringDoc OpenAPI 3** - Documentazione API
- **Caffeine** - Caching in-memory

### Frontend
- **HTML5/CSS3** - Markup e styling
- **JavaScript ES6+** - Logica frontend
- **HTTP Server** - Server di sviluppo
- **Responsive Design** - Compatibilità mobile

### DevOps & Tools
- **Docker & Docker Compose** - Containerizzazione
- **Node.js** - Script di utilità
- **Git** - Version control

## 📁 Struttura del Progetto

```
PrigioneRecord/
├── src/                          # Backend Java Spring Boot
│   ├── main/java/com/prigione/
│   │   ├── controller/           # REST Controllers
│   │   ├── service/              # Business Logic
│   │   ├── repository/           # Data Access Layer
│   │   ├── model/                # Entity Models
│   │   ├── config/               # Configurazioni
│   │   └── security/             # Security Configuration
│   └── main/resources/
│       └── application.yml       # Configurazione applicazione
├── frontend/                     # Frontend Web Application
│   ├── pages/                    # Pagine HTML
│   ├── components/               # Componenti riutilizzabili
│   ├── assets/                   # CSS, JS, immagini
│   ├── config/                   # Configurazioni frontend
│   └── index.html                # Homepage
├── target/                       # Build artifacts Maven
├── node_modules/                 # Dipendenze Node.js
├── pom.xml                       # Configurazione Maven
├── package.json                  # Configurazione Node.js
├── docker-compose.yml            # Setup Docker
└── README.md                     # Questo file
```

## 🚀 Quick Start

### Prerequisiti
- **JDK 17+**
- **Node.js 16+** (per script e frontend)
- **Docker & Docker Compose** (raccomandato)
- **Git**

### Installazione Rapida con Docker

1. **Clona il repository**
   ```bash
   git clone https://github.com/FraDevi04/PrigioneRecords.git
   cd PrigioneRecord
   ```

2. **Avvia MongoDB con Docker**
   ```bash
   docker-compose up -d
   ```

3. **Installa dipendenze Node.js**
   ```bash
   npm install
   ```

4. **Build e avvia il backend**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. **Avvia il frontend** (in un nuovo terminale)
   ```bash
   npm start
   ```

### Accesso all'Applicazione

- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Swagger UI**: [http://localhost:8080/api/swagger-ui/index.html](http://localhost:8080/api/swagger-ui/index.html)

## 📚 Documentazione API

L'applicazione include documentazione API completa tramite Swagger UI:

**🔗 [Swagger UI - Documentazione Interattiva](http://localhost:8080/api/swagger-ui/index.html)**

Funzionalità disponibili:
- 📖 Documentazione completa di tutti gli endpoint
- 🧪 Test API direttamente dall'interfaccia
- 📋 Schemi di richiesta e risposta
- 💡 Esempi pratici di utilizzo
- 🔍 Informazioni sui codici di stato HTTP

## 🔑 API Endpoints

### 🔐 Autenticazione
- `POST /api/auth/register` - Registrazione nuovo utente
- `POST /api/auth/login` - Login utente

### 🏢 Studi di Registrazione
- `GET /api/studi` - Lista completa studi
- `GET /api/studi/{id}` - Dettagli studio specifico
- `POST /api/studi` - Crea nuovo studio (admin)
- `PUT /api/studi/{id}` - Modifica studio (admin)
- `DELETE /api/studi/{id}` - Elimina studio (admin)

### 📅 Prenotazioni
- `POST /api/prenotazioni` - Crea nuova prenotazione
- `GET /api/prenotazioni` - Lista tutte le prenotazioni
- `GET /api/prenotazioni/mie` - Prenotazioni personali
- `DELETE /api/prenotazioni/{id}` - Cancella prenotazione

### ⭐ Recensioni
- `POST /api/recensioni` - Crea recensione
- `GET /api/recensioni/studio/{id}` - Recensioni per studio
- `GET /api/recensioni/mie` - Recensioni personali

### 📊 Dashboard
- `GET /api/dashboard` - Dati dashboard utente

## ⚙️ Configurazione

### Backend (application.yml)
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/prigione_records
  
jwt:
  secret: your-secret-key
  expiration: 86400000  # 24 ore
```

### Frontend (config/)
- Configurazioni API endpoints
- Costanti applicazione
- Configurazioni ambiente

## 🔒 Sicurezza

- ✅ **JWT Authentication** - Token sicuri per sessioni
- ✅ **BCrypt Password Hashing** - Crittografia password
- ✅ **Spring Security** - Protezione endpoint
- ✅ **CORS Configuration** - Controllo accessi cross-origin
- ✅ **Input Validation** - Validazione dati in ingresso
- ✅ **Rate Limiting** - Protezione contro spam

## 🧪 Testing e Debug

### Script di Utilità
```bash
# Test backend connectivity
node test_backend.js

# Correzione dati studi
node fix_studi_data.js
```

### Debug Tools
- File di debug: `frontend/debug_test.html`
- Test import: `frontend/test_import.html`

## 🚧 Sviluppo

### Setup Ambiente di Sviluppo
1. Configura IDE (IntelliJ IDEA/VS Code)
2. Installa plugin: Spring Boot, Java, JavaScript
3. Configura MongoDB locale o usa Docker
4. Imposta hot-reload per frontend

### Best Practices
- Usa branch feature per nuove funzionalità
- Scrivi test per nuove API
- Mantieni il codice documentato
- Segui le convenzioni Spring Boot

## 🤝 Contribuire

1. **Fork** il repository
2. **Crea** un branch feature (`git checkout -b feature/nuova-funzionalita`)
3. **Commit** le modifiche (`git commit -am 'Aggiunge nuova funzionalità'`)
4. **Push** al branch (`git push origin feature/nuova-funzionalita`)
5. **Apri** una Pull Request

## 👥 Team di Sviluppo

- **Francesco Devillanova** - Backend Developer
- **Davide Galliani** - Full-Stack Developer  
- **Francesco Bonavita** - Frontend Developer

## 📄 Licenza

Questo progetto è distribuito sotto licenza **MIT**. Vedi il file `LICENSE` per maggiori dettagli.

## 🆘 Supporto

Per problemi o domande:
- 🐛 Apri una [issue](https://github.com/FraDevi04/PrigioneRecords/issues)
- 📧 Contatta il team di sviluppo
- 📖 Consulta la documentazione Swagger

---

⭐ **Se questo progetto ti è utile, lascia una stella su GitHub!** ⭐