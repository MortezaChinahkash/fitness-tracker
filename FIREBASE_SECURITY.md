# 🔒 Firebase Sicherheitsrichtlinien

## ⚠️ KRITISCHE SICHERHEITSREGELN

### **NIEMALS COMMITTEN:**
- ✅ `.env` Dateien (enthalten API-Keys)
- ✅ `firebase.json` (Projekt-Konfiguration)
- ✅ Service Account Keys (`*-firebase-adminsdk-*.json`)
- ✅ Firebase Config Dateien mit echten Werten
- ✅ Private Keys (`.key`, `.pem` Dateien)

### **IMMER GESCHÜTZT:**
- ✅ Produktions-API-Keys
- ✅ Firebase Admin SDK Credentials
- ✅ Service Account Informationen
- ✅ Database-URLs mit Secrets

## 🚀 Setup für neue Entwickler

### 1. **Umgebungsvariablen einrichten:**
```bash
# Template kopieren
cp .env.example .env

# Echte Firebase-Werte eintragen (von Projektadministrator erhalten)
nano .env
```

### 2. **Firebase-Konfiguration erhalten:**
- Kontaktiere einen Projektadministrator
- Erhalte die echten Firebase-Konfigurationswerte
- Fülle die `.env` Datei aus
- **NIEMALS** die `.env` Datei committen!

### 3. **Firebase CLI Setup (optional):**
```bash
# Firebase CLI installieren
npm install -g firebase-tools

# Bei Firebase anmelden
firebase login

# Projekt auswählen (falls konfiguriert)
firebase use --add
```

## 🛡️ Sicherheitsebenen

### **Development (Entwicklung):**
- Separate Firebase-Projekte für Development
- Test-Daten, keine echten Benutzerdaten
- Erweiterte Debug-Logs erlaubt

### **Production (Produktion):**
- Streng getrennte Firebase-Projekte
- Minimale Logs
- Erweiterte Sicherheitsregeln
- Regelmäßige Key-Rotation

## 📋 Git-Sicherheit checken

### **Vor jedem Commit prüfen:**
```bash
# .gitignore Status prüfen
git status

# Sicherstellen, dass keine .env Dateien sichtbar sind
ls -la | grep .env

# Falls versehentlich staged:
git reset HEAD .env
git reset HEAD src/firebase/config.ts
```

### **Nach versehentlichem Commit:**
```bash
# Aus Git History entfernen
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch .env' \
--prune-empty --tag-name-filter cat -- --all

# Alle API-Keys SOFORT wechseln!
```

## ⚡ Notfall-Prozedur

### **Bei versehentlichem Key-Leak:**

1. **SOFORT:** Alle betroffenen API-Keys in Firebase Console deaktivieren
2. **Neue Keys generieren** in Firebase Console
3. **Git History säubern** (siehe oben)
4. **Team informieren** über Key-Wechsel
5. **Alle Umgebungen aktualisieren** mit neuen Keys

## 🔧 Firebase Console Links

- **Projekt-Einstellungen:** `https://console.firebase.google.com/project/[PROJECT_ID]/settings/general/`
- **API-Keys verwalten:** `https://console.firebase.google.com/project/[PROJECT_ID]/settings/general/`
- **Service Accounts:** `https://console.firebase.google.com/project/[PROJECT_ID]/settings/serviceaccounts/`

## 📂 Erlaubte Dateien

### **Können committet werden:**
- ✅ `firestore.rules` (Security Rules)
- ✅ `storage.rules` (Storage Rules)
- ✅ Firebase Functions Source Code
- ✅ `.env.example` (Template ohne echte Werte)

### **Vorsicht bei:**
- ⚠️ `firebase.json` (kann Projekt-IDs enthalten)
- ⚠️ `.firebaserc` (enthält Projekt-Referenzen)

## 🎯 Best Practices

### **Development:**
- Immer separate Test-Firebase-Projekte verwenden
- Niemals Produktions-Keys in Development
- Regelmäßige `.gitignore` Checks

### **Code Reviews:**
- Immer auf versehentliche Secret-Commits prüfen
- `.env` Dateien in Pull Requests ablehnen
- Firebase-Config-Änderungen genau prüfen

### **Deployment:**
- Umgebungsvariablen über CI/CD setzen
- Niemals Secrets in Docker Images
- Produktions-Deployments nur mit verifizierten Keys

---

## ✅ **Ihr Projekt ist jetzt sicher!**

Alle Firebase-bezogenen Dateien sind in der `.gitignore` geschützt und werden nicht versehentlich committet.
