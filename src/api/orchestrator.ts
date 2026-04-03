import { auth } from './firebase';

const ORCHESTRATOR_URL = import.meta.env.VITE_CISO_URL;

export async function sendMessageToCISO(text: string) {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required to access the CISO.");

    // 1. Get a fresh Bearer Token from Firebase
    // This token proves to your Cloud Run middleware who you are
    const idToken = await user.getIdToken();

    // 2. Format the request for the A2A Protocol
    // The ADK /message/send endpoint expects a specific JSON structure
    const response = await fetch(`${ORCHESTRATOR_URL}/message/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
            text: text, // The user's deployment requirements
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `CISO Error: ${response.status}`);
    }

    return await response.json();
}