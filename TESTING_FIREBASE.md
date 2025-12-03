# Firebase Testing Checklist

## Quick Test Steps

### 1. Basic Authentication Test
- [ ] Open http://localhost:5177 in your browser
- [ ] Click "Sign in with Google" in the navbar
- [ ] Complete Google sign-in flow
- [ ] Verify you see your profile picture and name in navbar
- [ ] Verify "Sign out" button appears

### 2. User Data Sync Test
- [ ] While signed in, navigate to Settings page
- [ ] Enter your name, email, phone, company
- [ ] Open Firebase Console → Firestore Database
- [ ] Find the `users` collection → your user document (by UID)
- [ ] Verify your data appears in Firestore

### 3. Signature Sync Test
- [ ] Create a new signature (draw/type/upload)
- [ ] Check Firestore - signature should be in `signatures` array
- [ ] Create another signature
- [ ] Verify both signatures are in Firestore

### 4. Multi-Device Sync Test
**Device/Browser A:**
- [ ] Sign in with Google
- [ ] Set name to "Test User A"
- [ ] Create a signature

**Device/Browser B (different browser or incognito):**
- [ ] Sign in with the SAME Google account
- [ ] Verify "Test User A" appears automatically
- [ ] Verify the signature appears automatically

**Device/Browser B:**
- [ ] Change name to "Test User B"

**Device/Browser A:**
- [ ] Without refreshing, name should change to "Test User B" automatically
- [ ] ✨ This confirms real-time sync is working!

### 5. Offline Test
- [ ] Sign in
- [ ] Open DevTools → Network tab
- [ ] Set network to "Offline"
- [ ] Try changing your name
- [ ] Should see "Error saving to Firestore" in console (expected)
- [ ] Set network back to "Online"
- [ ] Wait a few seconds
- [ ] Check Firestore - change should sync automatically

### 6. Sign Out Test
- [ ] Click "Sign out"
- [ ] Verify you're signed out
- [ ] Make changes to settings
- [ ] Changes should only save to localStorage, not Firestore
- [ ] Sign back in
- [ ] Your Firestore data should reload

### 7. Fallback to localStorage Test
- [ ] Do NOT sign in
- [ ] Add user data in Settings
- [ ] Create a signature
- [ ] Refresh the page
- [ ] Data should persist (from localStorage)
- [ ] But won't be in Firestore (since not signed in)

## Expected Console Logs

### On Sign In:
- No error messages
- Firestore reads for user data and signatures

### On Data Change:
- No error messages
- Firestore write for the updated field

### On Sign Out:
- "Signed out successfully" toast
- Real-time listeners cleaned up

## Common Issues

### Issue: "Sign in with Google" does nothing
**Solution:** Check that localhost is authorized in Firebase Console → Authentication → Settings → Authorized domains

### Issue: Firestore permission denied
**Solution:** Verify security rules are correctly set (see FIREBASE.md)

### Issue: Data not syncing across devices
**Solution:** 
- Verify both devices are signed in with the SAME Google account
- Check browser console for errors
- Verify Firestore has the data

### Issue: "Firebase already initialized" error
**Solution:** This is expected during HMR in development, can be ignored

## Manual Firestore Check

Go to Firebase Console → Firestore Database:

```
users/
  └── {your-google-uid}/
      ├── name: "Your Name"
      ├── email: "your@email.com"
      ├── initials: "YN"
      ├── phone: "..."
      ├── company: "..."
      └── signatures: [
            {
              id: "...",
              name: "...",
              dataUrl: "data:image/png;base64,..."
            }
          ]
```

All changes you make should appear here in real-time!
