# Firebase Integration Guide

This document explains how Firebase authentication and Firestore persistence are integrated into the Firma app.

## Overview

The app now supports multi-device synchronization of user data and signatures through Firebase. Users can sign in with Google, and their data will automatically sync across all devices where they're signed in.

## Features

✅ **Google Authentication** - Sign in with your Google account  
✅ **Real-time Sync** - Changes sync automatically across devices  
✅ **Offline Support** - Firestore caches data locally for offline access  
✅ **Fallback to localStorage** - Works without authentication using browser storage  
✅ **Secure** - Data is protected by Firestore security rules  

## Architecture

### Files Added/Modified

1. **`src/lib/firebase.ts`** - Firebase configuration and initialization
2. **`src/store/auth.ts`** - Authentication state management (new)
3. **`src/store/user.ts`** - Updated to sync with Firestore
4. **`src/store/signatures.ts`** - Updated to sync with Firestore
5. **`src/hooks/useFirebaseSync.ts`** - Hook to manage data synchronization (new)
6. **`src/components/Navbar.tsx`** - Added sign-in/sign-out UI
7. **`src/App.tsx`** - Initialize Firebase auth and sync

### Data Structure in Firestore

```
users (collection)
  └── {userId} (document)
      ├── name: string
      ├── initials: string
      ├── email: string
      ├── phone: string
      ├── company: string
      └── signatures: Signature[]
```

### How It Works

#### 1. Authentication Flow

When a user clicks "Sign in with Google":
1. `useAuthStore.signInWithGoogle()` is called
2. Firebase opens a Google sign-in popup
3. On success, `onAuthStateChanged` listener updates the auth state
4. The user object is stored in Zustand state

#### 2. Data Synchronization

When the user signs in:
1. `useFirebaseSync()` hook detects the authenticated user
2. Calls `syncWithFirestore()` on both user and signatures stores
3. Sets up real-time listeners via `onSnapshot()`
4. Any changes in Firestore automatically update local state
5. Any local changes are saved to Firestore via `saveToFirestore()`

#### 3. Offline Support

Firestore automatically handles offline scenarios:
- Reads from local cache when offline
- Queues writes and syncs when back online
- No additional code needed

#### 4. Fallback to localStorage

For users who don't sign in:
- Data continues to be stored in localStorage via Zustand persist
- Works exactly as before Firebase integration
- No cloud sync available

## Security Rules

The Firestore security rules ensure users can only access their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This means:
- Users must be authenticated to read/write data
- Users can only access documents where the document ID matches their user ID
- No user can access another user's data

## Testing Multi-Device Sync

To test the sync functionality:

1. **Device A**: Sign in with Google
2. **Device A**: Go to Settings and update your name/email
3. **Device A**: Create a signature
4. **Device B**: Open the app and sign in with the same Google account
5. **Device B**: Your name, email, and signature should automatically appear
6. **Device B**: Make a change (e.g., update phone number)
7. **Device A**: The change should appear automatically without refreshing

## Troubleshooting

### Authentication Issues

If sign-in fails:
- Check the browser console for errors
- Verify the Firebase project has Google auth enabled
- Check that the domain is authorized in Firebase Console

### Data Not Syncing

If data doesn't sync:
- Check browser console for Firestore errors
- Verify Firestore security rules are correctly set
- Check Network tab to ensure Firestore requests are going through
- Try signing out and back in

### Offline Behavior

When offline:
- Changes are saved to local cache
- They will sync automatically when back online
- Check console logs for "Error syncing" messages

## Development Notes

### Store Pattern

Both `useUserStore` and `useSignaturesStore` follow this pattern:

1. **Zustand persist** for localStorage backup
2. **syncWithFirestore()** returns an unsubscribe function for cleanup
3. **saveToFirestore()** is called after every state change when authenticated
4. **onSnapshot()** listener updates local state from remote changes

### Avoiding Infinite Loops

The stores are designed to avoid sync loops:
- `saveToFirestore()` only writes, doesn't trigger local updates
- `onSnapshot()` only reads, uses `set()` directly (doesn't trigger saves)
- Each operation is one-way: local → Firestore OR Firestore → local

### Adding New Fields

To add a new synced field:

1. Add it to the Zustand store state and actions
2. Include it in the `saveToFirestore()` payload
3. Include it in the `syncWithFirestore()` snapshot handler
4. No changes needed to Firebase config or security rules

## Performance Considerations

### Signature Storage

Signatures are stored as base64 strings in Firestore. Current approach:
- ✅ Simple implementation
- ✅ Automatic sync with Firestore offline cache
- ⚠️ May hit document size limits if many large signatures (max 1MB per document)

**If needed in the future**: Migrate to Firebase Storage for large signatures:
- Store signatures in Firebase Storage as image files
- Store URLs in Firestore instead of base64 strings
- Requires additional implementation

### Write Frequency

Current implementation writes to Firestore on every change. This is fine for:
- User fields (name, email, etc.) - infrequent changes
- Signatures - occasional additions/deletions

If you add frequently-changing data, consider debouncing writes.

## Cost Considerations

Firebase Free Tier (Spark Plan):
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 1GB storage

Typical usage for this app:
- ~3 reads on sign-in (user + signatures)
- ~1 write per field change
- ~1 write per signature add/delete

This should easily stay within free tier limits for moderate usage.
