# Firebase Setup Guide

Dieser Guide führt Sie durch die Einrichtung von Firebase für Ihre Fitness-Tracker-App.

## 1. Firebase-Projekt erstellen

1. Gehen Sie zur [Firebase Console](https://console.firebase.google.com/)
2. Klicken Sie auf "Projekt hinzufügen"
3. Geben Sie einen Projektname ein (z.B. "fitness-tracker")
4. Folgen Sie den Setup-Schritten (Google Analytics ist optional)

## 2. Web-App zu Firebase-Projekt hinzufügen

1. In der Firebase Console, klicken Sie auf das Web-Icon (</>)
2. Registrieren Sie Ihre App (z.B. "Fitness Tracker Web")
3. **Wichtig**: Kopieren Sie die Firebase-Konfiguration, die angezeigt wird

## 3. Firebase-Services aktivieren

### Authentication
1. Gehen Sie zu "Authentication" > "Sign-in method"
2. Aktivieren Sie "Email/Password"
3. Optional: Aktivieren Sie andere Anmeldmethoden (Google, etc.)

### Firestore Database
1. Gehen Sie zu "Firestore Database"
2. Klicken Sie "Datenbank erstellen"
3. Wählen Sie "Im Testmodus starten" (später können Sie die Regeln anpassen)
4. Wählen Sie eine Region aus (z.B. europe-west3 für Deutschland)

### Storage
1. Gehen Sie zu "Storage"
2. Klicken Sie "Loslegen"
3. Wählen Sie "Im Testmodus starten"
4. Wählen Sie dieselbe Region wie für Firestore

## 4. Umgebungsvariablen konfigurieren

1. Kopieren Sie `.env.example` zu `.env`:
   ```bash
   cp .env.example .env
   ```

2. Tragen Sie Ihre Firebase-Konfiguration in die `.env` Datei ein:
   ```env
   VITE_FIREBASE_API_KEY=IhrApiKey
   VITE_FIREBASE_AUTH_DOMAIN=ihr-projekt-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=ihr-projekt-id
   VITE_FIREBASE_STORAGE_BUCKET=ihr-projekt-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=IhreSenderId
   VITE_FIREBASE_APP_ID=IhreAppId
   ```

## 5. Firestore-Sicherheitsregeln (Optional)

Für Produktionsumgebungen sollten Sie die Firestore-Regeln anpassen:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Benutzer können nur ihre eigenen Workouts lesen/schreiben
    match /workouts/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Benutzer können nur ihr eigenes Profil lesen/schreiben
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 6. Storage-Sicherheitsregeln (Optional)

Für Profilbilder:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 7. App starten

Nach der Konfiguration können Sie die App starten:

```bash
npm run dev
```

## Troubleshooting

### Fehler: "Missing Firebase configuration"
- Überprüfen Sie, ob die `.env` Datei existiert und alle Werte ausgefüllt sind
- Stellen Sie sicher, dass alle Variablennamen mit `VITE_` beginnen

### Fehler: "Permission denied"
- Überprüfen Sie die Firestore-Sicherheitsregeln
- Stellen Sie sicher, dass der Benutzer authentifiziert ist

### Fehler: "Storage bucket not configured"
- Stellen Sie sicher, dass Firebase Storage aktiviert ist
- Überprüfen Sie die Storage-Bucket-URL in der Konfiguration

## Firebase-Features in der App

### Authentication
- Benutzerregistrierung mit E-Mail/Passwort
- Anmeldung/Abmeldung
- Passwort zurücksetzen
- Profilverwaltung

### Firestore Database
- Workout-Speicherung per Benutzer
- Echtzeit-Synchronisation
- Benutzerprofile

### Storage
- Profilbild-Upload
- Bildoptimierung und -validierung

## Nächste Schritte

1. Testen Sie die Authentifizierung
2. Erstellen Sie Test-Workouts
3. Laden Sie ein Profilbild hoch
4. Überprüfen Sie die Daten in der Firebase Console
5. Passen Sie die Sicherheitsregeln für Produktion an
