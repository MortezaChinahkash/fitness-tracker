# Firebase Storage CORS Fix - Schritt-für-Schritt Anleitung

## Das Problem
CORS-Fehler bei Firebase Storage treten auf, weil:
1. Firebase Storage Security Rules zu restriktiv sind
2. Die Storage-Bucket-Konfiguration nicht korrekt ist
3. Firebase Storage nicht für öffentlichen Zugriff konfiguriert ist

## SOFORTIGE LÖSUNG (Firebase Console)

### Schritt 1: Firebase Storage Rules ändern
1. Gehen Sie zu https://console.firebase.google.com
2. Wählen Sie Ihr Projekt "fitness-tracker-babd1"
3. Navigieren Sie zu **Storage** → **Rules**
4. Ersetzen Sie die aktuellen Rules mit:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Öffentlicher Lesezugriff für Profilbilder
    match /profile-pictures/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Authentifizierte Benutzer können ihre eigenen Dateien verwalten
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Klicken Sie auf **Publish**

### Schritt 2: Bucket-Berechtigungen setzen
1. Gehen Sie zu **Storage** → **Files**
2. Klicken Sie auf die drei Punkte (...) neben Ihrem Bucket
3. Wählen Sie **Edit access**
4. Fügen Sie hinzu:
   - **Principal**: `allUsers`
   - **Role**: `Storage Object Viewer`

### Schritt 3: CORS für Development aktivieren
Da Sie localhost:5173 verwenden, müssen CORS-Headers explizit gesetzt werden.

## ALTERNATIVE LÖSUNG (Wenn CORS weiterhin nicht funktioniert)

Verwenden Sie die Base64-Fallback-Methode, die ich bereits im Code implementiert habe.
