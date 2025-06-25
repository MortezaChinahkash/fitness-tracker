# CORS-Fehler Lösung - Schritt für Schritt Anleitung

## 🚨 Aktueller Status
CORS-Fehler blockieren alle Firebase Storage-Anfragen, einschließlich einfacher GET-Requests. Dies deutet auf ein grundlegendes Konfigurationsproblem hin.

## 📋 Sofortmaßnahmen (in dieser Reihenfolge ausführen)

### 1. Firebase Storage Security Rules überprüfen und korrigieren

1. Öffnen Sie die [Firebase Console](https://console.firebase.google.com)
2. Wählen Sie Ihr Projekt "fitness-tracker-babd1"
3. Gehen Sie zu **Storage** → **Rules**
4. Ersetzen Sie die aktuellen Regeln mit:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Erlaubt Lesen und Schreiben für authentifizierte Benutzer
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Klicken Sie auf **Publish** (Veröffentlichen)

### 2. Firebase Storage Bucket-Berechtigungen prüfen

1. Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com)
2. Wählen Sie Ihr Projekt "fitness-tracker-babd1"
3. Navigieren Sie zu **Cloud Storage** → **Browser**
4. Finden Sie den Bucket "fitness-tracker-babd1.appspot.com"
5. Klicken Sie auf das Bucket
6. Gehen Sie zum Tab **PERMISSIONS**
7. Stellen Sie sicher, dass die folgenden Rollen existieren:
   - **Storage Admin**: Ihr Google-Account
   - **Storage Object Creator**: Ihr Google-Account
   - **Storage Object Viewer**: allUsers (für öffentliche Bilder)

### 3. Firebase Authentication Status überprüfen

**Führen Sie diesen Test aus:**
```javascript
// Öffnen Sie die Browser-Konsole auf http://localhost:5175
// Und führen Sie aus:
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('✅ User authenticated:', user.uid);
    console.log('🔑 Access Token:', user.accessToken ? 'Present' : 'Missing');
  } else {
    console.log('❌ User not authenticated');
  }
});
```

### 4. Alternative: Temporäre offene Regeln (NUR ZUM TESTEN)

**⚠️ WARNUNG: Nur für Tests verwenden!**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // TEMPORÄR - nicht in Produktion verwenden!
    }
  }
}
```

### 5. Browser-Cache und Cookies löschen

1. Öffnen Sie Developer Tools (F12)
2. Rechtsklick auf den Reload-Button
3. Wählen Sie "Empty Cache and Hard Reload"
4. Oder: Inkognito-Modus zum Testen verwenden

### 6. Firebase SDK Version überprüfen

Überprüfen Sie die Firebase-Version in `package.json`:
```json
{
  "dependencies": {
    "firebase": "^10.7.1"
  }
}
```

Falls eine ältere Version vorhanden ist, aktualisieren Sie:
```bash
npm install firebase@latest
```

## 🔧 Code-Fixes

### Authentifizierung vor Storage-Operationen sicherstellen:

```typescript
// In storageService.ts - Authentifizierung prüfen
import { auth } from './config'

export async function uploadProfilePictureSecure(
  userId: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Authentifizierung prüfen
  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error('Benutzer nicht authentifiziert')
  }

  // Warten bis das Auth-Token verfügbar ist
  const token = await currentUser.getIdToken()
  if (!token) {
    throw new Error('Kein gültiges Authentifizierungs-Token')
  }

  console.log('✅ User authenticated, proceeding with upload')
  
  // Bestehende Upload-Logik...
  return await uploadProfilePicture(userId, file, onProgress)
}
```

## 🧪 Debugging-Schritte

### Test 1: Authentifizierung prüfen
```javascript
// Browser-Konsole
console.log('Auth user:', firebase.auth().currentUser)
console.log('Auth token:', await firebase.auth().currentUser?.getIdToken())
```

### Test 2: Storage-Referenz testen
```javascript
// Browser-Konsole
const storage = firebase.storage()
const ref = storage.ref('test.txt')
console.log('Storage ref:', ref.fullPath)
```

### Test 3: Network-Tab analysieren
1. Öffnen Sie Developer Tools → Network
2. Versuchen Sie einen Upload
3. Schauen Sie sich die fehlgeschlagene Anfrage an
4. Prüfen Sie Request/Response Headers

## 📱 Alternative Lösungsansätze

### Option A: Firebase Storage Web API direkt verwenden
```typescript
// Direkter API-Aufruf ohne SDK
export async function uploadWithRestAPI(userId: string, file: File): Promise<string> {
  const token = await auth.currentUser?.getIdToken()
  
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch(
    `https://firebasestorage.googleapis.com/v0/b/fitness-tracker-babd1.appspot.com/o/profile-pictures%2F${userId}%2F${Date.now()}_${file.name}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    }
  )
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.downloadTokens ? 
    `https://firebasestorage.googleapis.com/v0/b/fitness-tracker-babd1.appspot.com/o/profile-pictures%2F${userId}%2F${data.name}?alt=media&token=${data.downloadTokens}` :
    data.mediaLink
}
```

### Option B: Base64-Upload als Fallback
```typescript
// Als Notlösung - Bilder als Base64 in Firestore speichern
export async function saveImageAsBase64(userId: string, file: File): Promise<string> {
  const base64 = await fileToBase64(file)
  
  // In Firestore speichern
  await updateFirestoreProfile(userId, {
    avatar: base64,
    avatarUpdated: new Date().toISOString()
  })
  
  return base64
}
```

## ✅ Erfolgskontrolle

Nach der Durchführung der Schritte:

1. **Browser neu starten**
2. **App neu laden**: http://localhost:5175
3. **Einloggen** und **Profilbild hochladen**
4. **Konsole prüfen** auf Fehler
5. **Network-Tab prüfen** - keine CORS-Fehler

## 🆘 Falls nichts funktioniert

1. **Neues Firebase-Projekt erstellen** mit korrekter Konfiguration
2. **Firebase CLI verwenden** für lokale Emulation:
   ```bash
   npm install -g firebase-tools
   firebase init emulators
   firebase emulators:start
   ```
3. **Support kontaktieren**: Firebase-Support mit Projekt-ID und Fehlermeldungen

## 📞 Nächste Schritte

1. Führen Sie **Schritt 1-3** sofort aus
2. **Testen** Sie den Upload erneut
3. **Melden** Sie das Ergebnis zurück

**Wichtig**: Die Firebase Storage Security Rules sind der wahrscheinlichste Grund für das Problem!
