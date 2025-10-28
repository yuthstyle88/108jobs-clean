// --- E2EE bootstrap mounted once at app root (not tied to rooms list) ---
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {useEffect} from "react";
import {UserService} from "@/services";
import {ensureIdentityKeyPair, ensureSharedKeyForLocalUser} from "@/modules/chat/utils/security/crypto";
import {exchange} from "@/lib/api/auth";

let __e2eeInitInFlight = false;
let __e2eeInitializedForUser: number | null = null;

export const EnsureSharedKeyBootstrap: React.FC = () => {
    const { localUser } = useMyUser();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const isLoggedIn = UserService.Instance.isLoggedIn;
            const uid = Number((localUser as any)?.id) || 0;
            if (!isLoggedIn || !uid) return;

            // If already initialized for this user and a key exists, skip.
            if (__e2eeInitializedForUser === uid && UserService.Instance.authInfo?.sharedKey) return;
            // Avoid concurrent runs.
            if (__e2eeInitInFlight) return;

            __e2eeInitInFlight = true;
            try {
                const { privateKey, publicKeyHex } = await ensureIdentityKeyPair();
                const serverPublicKeyHex = await exchange(publicKeyHex);
                if (!cancelled) {
                    await ensureSharedKeyForLocalUser(uid, privateKey, serverPublicKeyHex);
                    __e2eeInitializedForUser = uid;
                }
            } catch (e) {
                // best effort; allow a retry on next render if needed
            } finally {
                __e2eeInitInFlight = false;
            }
        })();
        return () => { cancelled = true; };
    }, [localUser?.id, UserService.Instance.isLoggedIn]);

    return null;
};
