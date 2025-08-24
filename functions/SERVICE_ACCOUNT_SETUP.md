# Firebase Admin Service Account Setup

## Steps to configure Firebase Admin SDK with Service Account:

### 1. Generate Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file

### 2. Configure the Service Account

1. Replace the content of `src/config/admin.json` with your downloaded service account JSON
2. Make sure to replace these placeholder values with your actual values:
   - `your-project-id`: Your Firebase project ID
   - `your-private-key-id`: The private key ID from your service account
   - `YOUR_PRIVATE_KEY_HERE`: The actual private key (keep the formatting with \n)
   - `firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com`: Your service account email
   - `your-client-id`: Your client ID

### 3. Security Note

⚠️ **IMPORTANT**: Never commit the actual service account file to version control!

Add this to your `.gitignore`:

```
src/config/admin.json
```

### 4. For Development (Emulator)

When running in the Firebase emulator, the service account is not needed. The code will automatically detect the emulator environment and use mock tokens for development.

### 5. For Production

In production, the service account will be used to authenticate and create custom tokens for user login.

## Current Implementation

The login method now:

1. Tries to create a custom token using the service account
2. If it fails (e.g., in emulator), falls back to a mock token
3. Returns the user data with the token

This allows seamless development in emulator mode while supporting production authentication.
