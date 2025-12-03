# Task: Implement Multi-Device Persistence for User Fields and Signatures in React PDF Tool App

## Objective
Enhance the existing client-side React (Vite) web application for loading PDFs, adding configurable text fields (e.g., name, email), and signatures (captured as small images from a canvas). Currently, user data is persisted in localStorage for browser-specific access. The goal is to enable multi-device syncing while integrating with Google Sign-In. Use Firebase as the primary solution for cloud-based persistence, with a fallback to localStorage. Ensure the implementation is minimally invasive, secure, and maintains offline support where possible.

## Background and Requirements
- **App Context**: The app allows users to load PDFs, add text fields (e.g., name, email), and sign via a canvas (signatures saved as base64-encoded strings, typically 10-50KB).
- **Current Persistence**: Data is stored in localStorage, keyed by Google Sign-In user ID (e.g., `user_${user.uid}` as JSON: `{ name, email, signature }`).
- **New Features**:
  - Sync user data (name, email, signature) across devices using Firebase Realtime Database (or Firestore if preferred for structured data).
  - Tie data to the authenticated user's ID from Google Sign-In.
  - Handle real-time syncing: Changes on one device should reflect on others automatically.
  - Fallback to localStorage for offline or non-signed-in scenarios.
  - Support offline caching (Firebase handles this natively).
  - For signatures: Store as base64 strings in the database; if sizes grow, consider Firebase Storage for URLs.
- **Integration with Google Sign-In**: Reuse existing Google OAuth flow (e.g., via `@react-oauth/google` or Firebase Auth). No additional scopes beyond sign-in are needed.
- **Minimally Invasive**: Add Firebase SDK without major codebase rewrites. Setup time: ~15-30 minutes in Firebase console.
- **Security**: Implement basic Firebase security rules (e.g., authenticated users can only read/write their own data).
- **Testing**: Prototype in Vite; ensure data persists across sessions/devices and works with PDF field population.

## Step-by-Step Implementation Guide
1. **Setup Firebase Project**:
   - Create a free Firebase project in the Firebase console (console.firebase.google.com).
   - Add a web app to the project and copy the `firebaseConfig` object.
   - Enable Authentication with Google provider.
   - Enable Realtime Database (or Firestore) and set up basic security rules:
     ```
     // For Realtime Database:
     {
       "rules": {
         "users": {
           "$uid": {
             ".read": "$uid === auth.uid",
             ".write": "$uid === auth.uid"
           }
         }
       }
     }
     ```
     (Adapt for Firestore if used.)

2. **Install Dependencies**:
   - Run: `npm install firebase`.
   - If not already installed, ensure Google Sign-In library is present (e.g., `@react-oauth/google` or use Firebase Auth directly).

3. **Initialize Firebase in the App**:
   - In your main app file (e.g., `main.jsx` or a config file), add:
     ```javascript
     import { initializeApp } from 'firebase/app';
     import { getAuth } from 'firebase/auth';
     import { getDatabase } from 'firebase/database'; // Or getFirestore for Firestore

     const firebaseConfig = {
       // Paste your config here: apiKey, authDomain, projectId, etc.
     };

     const app = initializeApp(firebaseConfig);
     const auth = getAuth(app);
     const db = getDatabase(app); // Or const db = getFirestore(app);
     // Export auth and db for use in components
     ```

4. **Handle Google Sign-In and User Authentication**:
   - Use Firebase Auth for sign-in if not already integrated:
     ```javascript
     import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

     const provider = new GoogleAuthProvider();
     signInWithPopup(auth, provider)
       .then((result) => {
         const user = result.user;
         // Proceed to load/save data
       })
       .catch((error) => {
         console.error(error);
       });
     ```
   - On app load, listen for auth state changes:
     ```javascript
     import { onAuthStateChanged } from 'firebase/auth';

     onAuthStateChanged(auth, (user) => {
       if (user) {
         // Load data from Firebase
       } else {
         // Handle signed-out state, use localStorage if needed
       }
     });
     ```

5. **Save User Data to Firebase**:
   - After capturing user input (e.g., in a form or after signing):
     ```javascript
     import { ref, set } from 'firebase/database'; // Or doc, setDoc for Firestore

     const saveData = (user, data) => {
       const userRef = ref(db, `users/${user.uid}`);
       set(userRef, {
         name: data.name,
         email: data.email,
         signature: data.signature // base64 from canvas.toDataURL('image/png')
       }).catch((error) => console.error(error));

       // Optional: Mirror to localStorage as fallback
       localStorage.setItem(`user_${user.uid}`, JSON.stringify(data));
     };
     ```

6. **Load and Sync User Data from Firebase**:
   - Use real-time listener for syncing:
     ```javascript
     import { ref, onValue } from 'firebase/database'; // Or onSnapshot for Firestore

     const loadData = (user, setAppState) => {
       const userRef = ref(db, `users/${user.uid}`);
       onValue(userRef, (snapshot) => {
         const data = snapshot.val() || {};
         setAppState(data); // Update React state with name, email, signature
       });

       // Initial fallback from localStorage
       const storedData = JSON.parse(localStorage.getItem(`user_${user.uid}`)) || {};
       setAppState(storedData);
     };
     ```
   - Integrate into components that handle PDF fields (e.g., auto-populate name/email/signature).

7. **Handle Offline and Fallback**:
   - Firebase automatically caches data for offline use.
   - On load, check localStorage first, then sync with Firebase when online.
   - Add error handling for network issues.

8. **Optional: Google Drive Alternative (If Firebase Not Feasible)**:
   - If switching to Google Drive for file-based storage:
     - Enable Drive API in Google Cloud Console.
     - Add scopes: `https://www.googleapis.com/auth/drive.file`.
     - Use `gapi` library to create/update a JSON file in user's Drive.
     - Code snippet for reference (as provided in research):
       ```javascript
       // Load gapi, sign in, then:
       const userData = { name, email, signature };
       const fileContent = JSON.stringify(userData);
       const metadata = { name: 'myAppData.json', mimeType: 'application/json' };
       // List and update/create file via gapi.client.drive.files
       ```
   - Pros/Cons: Personal storage, but no real-time sync; more OAuth prompts.

## Additional Notes
- **Data Validation**: Client-side validation for inputs; compress base64 signatures if needed (e.g., resize canvas).
- **Performance**: Base64 is fine for small signatures; monitor sizes.
- **Testing Steps**:
  - Sign in on Device A, save data, verify in Firebase console.
  - Sign in on Device B, confirm data loads automatically.
  - Test offline: Disconnect, edit data, reconnect to sync.
- **Edge Cases**: Handle sign-out (clear localStorage), multiple users, data conflicts (Firebase last-write-wins).
- **Resources**: Refer to Firebase docs (firebase.google.com/docs) for auth/database. If issues, provide console logs for debugging.

Implement this in the existing codebase, ensuring compatibility with Vite and React hooks/state management (e.g., useState, useEffect).

# Scratch

```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHedBOefUyMbma2DAu6D3zmapSFpfh2hA",
  authDomain: "firma-f5dbb.firebaseapp.com",
  projectId: "firma-f5dbb",
  storageBucket: "firma-f5dbb.firebasestorage.app",
  messagingSenderId: "647721945126",
  appId: "1:647721945126:web:0a003c57bce633d17e7ee7",
  measurementId: "G-QXRJRD74XQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```