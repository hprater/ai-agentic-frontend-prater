import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// Prevent double-initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

/**
 * Robust token retrieval that waits for the Firebase Auth "Heartbeat"
 */
export const getBearerToken = async (): Promise<string | null> => {
    let user = auth.currentUser;

    if (!user) {
        user = await new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (u) => {
                unsubscribe();
                resolve(u);
            });
        });
    }

    if (!user) return null;
    return await user.getIdToken(true);
};