import {ID_PRIV_KEY_IDB, ID_PUB_SEC1_HEX_KEY} from "@/modules/chat/constants";
const crypto = globalThis.crypto;
import {UserService} from "@/services";
import {idbGet, idbSet} from "@/utils";

export type AESKey = CryptoKey;


// WebCrypto handle
const subtle = typeof window !== "undefined" ? window.crypto?.subtle : undefined;

// === Hex helpers ===
const hexToBytes = (hex: string) => new Uint8Array(hex.match(/.{1,2}/g)!.map(h => parseInt(h, 16)));
const bytesToHex = (buf: ArrayBuffer | Uint8Array) => {
  const a = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return Array.from(a).map(b => b.toString(16).padStart(2, "0")).join("");
};

// === Identity keypair (ECDH P-256) ===
export async function ensureIdentityKeyPair(): Promise<{ privateKey: CryptoKey; publicKeyHex: string }> {
  if (!subtle) throw new Error("WebCrypto not available");

  const existingPriv = await idbGet<CryptoKey>(ID_PRIV_KEY_IDB);
  const existingPubHex = localStorage.getItem(ID_PUB_SEC1_HEX_KEY) || undefined;
  if (existingPriv && existingPubHex) return { privateKey: existingPriv, publicKeyHex: existingPubHex };

  // Generate extractable pair to export public, then re-import private as non-extractable
  const pair = (await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"])) as CryptoKeyPair;
  const pubRaw = await subtle.exportKey("raw", pair.publicKey); // 65 bytes, SEC1 uncompressed
  const publicKeyHex = bytesToHex(pubRaw);

  const pkcs8 = await subtle.exportKey("pkcs8", pair.privateKey);
  const privateKey = await subtle.importKey("pkcs8", pkcs8, { name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]);

  await idbSet(ID_PRIV_KEY_IDB, privateKey);
  localStorage.setItem(ID_PUB_SEC1_HEX_KEY, publicKeyHex);
  return { privateKey, publicKeyHex };
}

// === Peer public key (strict SEC1 uncompressed hex) ===
async function importServerPublicKeyHex(sec1Hex: string): Promise<CryptoKey> {
  if (!subtle) throw new Error("WebCrypto not available");
  const hex = String(sec1Hex || "").trim().toLowerCase();
  if (hex.length !== 130 || !hex.startsWith("04")) {
    throw new Error("Public key must be uncompressed SEC1 hex (130 chars, starts with 04)");
  }
  return subtle.importKey("raw", hexToBytes(hex), { name: "ECDH", namedCurve: "P-256" }, true, []);
}

// === Derive AES-GCM-256 directly from ECDH (no HKDF) ===
async function deriveKeyAesGcmKey(privateKey: CryptoKey, serverPublicKeyHex: string): Promise<CryptoKey> {
  const peerPub = await importServerPublicKeyHex(serverPublicKeyHex);
  const shared = await subtle!.deriveBits({ name: "ECDH", public: peerPub }, privateKey, 256); // 32 bytes
  return subtle!.importKey("raw", shared, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

// In-memory cache: localUserId -> AES key (hex)
const LOCAL_USER_KEYS_MEM = new Map<string, CryptoKey>();

// Ensure a shared AES key for a room using the peer's public key (hex, strict 130)
export async function ensureSharedKeyForLocalUser(
  localUserId: string | number,
  privateKey: CryptoKey,
  sharedOrPubHex: string
): Promise<CryptoKey | null> {
    try {
        // guard: ต้องมี WebCrypto
        if (typeof window === 'undefined' || !window.crypto?.subtle) return null;
        console.log('[crypto] ensureSharedKeyForLocalUser', { localUserId, sharedOrPubHex });
        const keyId = String(localUserId);

        // 1) ใช้ cache ถ้ามี
        const cached = LOCAL_USER_KEYS_MEM.get(keyId);
        if (cached) {
            // sync เข้า global สำหรับ consumer ที่อ่านจาก UserService
            UserService.Instance.authInfo = {
                ...(UserService.Instance.authInfo ?? {}),
                sharedKey: cached,
                claims: UserService.Instance.authInfo?.claims,
            };
            return cached;
        }

        // 2) ทำความสะอาด input
        let hex = String(sharedOrPubHex || '').trim().toLowerCase();
        if (!hex) return null;
        if (hex.startsWith('0x')) hex = hex.slice(2);

        let aes: CryptoKey | null = null;

        // 3) ถ้าเป็น AES-256 (64 hex) → import
        if (hex.length === 64) {
            aes = await importAesKey(hex);
        } else {
            // 4) ถ้าเป็น public key → เติม '04' ถ้าขาด แล้ว derive
            if (hex.length === 128) hex = `04${hex}`;
            if (hex.length === 130 && hex.startsWith('04')) {
                aes = await deriveKeyAesGcmKey(privateKey, hex);
            }
        }

        if (!aes) return null;

        // 5) cache และ sync เข้า UserService
        LOCAL_USER_KEYS_MEM.set(keyId, aes);
        UserService.Instance.authInfo = {
            ...(UserService.Instance.authInfo ?? {}),
            sharedKey: aes,
            claims: UserService.Instance.authInfo?.claims,
        };

        return aes;
    } catch (err) {
        try { console.warn('[crypto] ensureSharedKeyForLocalUser failed', err); } catch {}
        return null;
    }
}
// Import AES key from hex (64 chars)
export async function importAesKey(sharedKeyHex: string): Promise<AESKey> {
  if (!subtle) throw new Error("WebCrypto not available");
  const hex = String(sharedKeyHex || "").trim().toLowerCase();
  if (hex.length !== 64) throw new Error("AES-256 key must be 32 bytes (64 hex chars)");
  return subtle.importKey("raw", hexToBytes(hex), { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

// Derive AES key hex using a known private key and the server's public key hex
export async function deriveAesGcmKeyHex(clientPrivateKey: CryptoKey, serverPubHex: string): Promise<string> {
  if (!subtle) throw new Error("WebCrypto not available");
  const serverPub = await importServerPublicKeyHex(serverPubHex);
  const shared = await subtle.deriveBits({ name: "ECDH", public: serverPub }, clientPrivateKey, 256);
  const aes = await subtle.importKey("raw", shared, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  return bytesToHex(await subtle.exportKey("raw", aes));
}
/**
 * AES-GCM-encrypt a UTF-8 string and return Base64 ciphertext with prepended nonce.
 *
 * The nonce is randomly generated (12 bytes, recommended for GCM) and prepended to the ciphertext.
 * The nonce is included in the output to allow decryption without separate storage.
 *
 * @param data       Plaintext string.
 * @param key        Symmetric `CryptoKey` (AES-GCM, 128/192/256-bit).
 * @returns          Base64 string containing nonce (12 bytes) + ciphertext.
 */
export async function encrypt(
  data: string,
  key: CryptoKey,
): Promise<string> {
    const nonce = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes is recommended for GCM
    const encoded = new TextEncoder().encode(data);

    const ciphertextBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      encoded,
    );

    // Prepend nonce to ciphertext
    const combined = new Uint8Array(nonce.length + ciphertextBuffer.byteLength);
    combined.set(nonce, 0);
    combined.set(new Uint8Array(ciphertextBuffer), nonce.length);

    return Buffer.from(combined).toString("base64");
}

/**
 * Decrypt ciphertext produced by {@link encrypt}.
 *
 * @param ciphertextBase64  Base64 string containing nonce (12 bytes) + ciphertext.
 * @param key               Symmetric `CryptoKey` (same as encryption).
 * @returns                 Decrypted plaintext string (UTF-8).
 */
export async function decrypt(
  ciphertextBase64: string,
  key: CryptoKey,
): Promise<string> {
    const combined = Buffer.from(ciphertextBase64, "base64");
    if (combined.length < 12) {
        throw new Error("Ciphertext too short to contain valid nonce");
    }

    const nonce = combined.slice(0, 12); // Extract first 12 bytes as nonce
    const ciphertext = combined.slice(12); // Remainder is ciphertext

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      ciphertext,
    );

    return new TextDecoder().decode(decryptedBuffer);
}
