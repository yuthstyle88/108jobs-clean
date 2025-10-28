import {HttpService, REQUEST_STATE} from "@/services/HttpService";

// Publish identity public key (idempotent). No DH with server.
// Keep the name `exchange` to minimize ripple changes, but it now returns the stored public key (echo).
export async function exchange(publicKeyHex: string) {
    // If caller provided a key, publish it; otherwise try to load or generate
    const resp = await HttpService.client.exchangePublicKey({ publicKey: publicKeyHex });

    if (resp.state !== REQUEST_STATE.SUCCESS || !resp.data) {
        throw (resp as any).err ?? new Error("Failed to publish identity public key");
    }
    // Return what server echoes back (or void). No shared secret here anymore.
    return resp.data.publicKey;
}

