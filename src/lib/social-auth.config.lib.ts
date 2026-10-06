import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function configureGoogleSignIn() {
    GoogleSignin.configure({
        webClientId:
            process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
        offlineAccess: false,
        // scopes: ['profile', 'email'], // defaults to profile and email automatically
    });
}
