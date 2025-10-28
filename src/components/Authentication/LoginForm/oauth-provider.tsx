import {OAuthProvider, PublicOAuthProvider,} from "lemmy-js-client";
import {useTranslation} from "react-i18next";

function getProviderKey(p: PublicOAuthProvider): string {
    const name = (p.displayName || "").toLowerCase();
    const issuer = (p.issuer || "").toLowerCase();
    // Check issuer domain then fallback to name
    if (issuer.includes("google")) return "google";
    if (issuer.includes("github")) return "github";
    if (issuer.includes("facebook")) return "facebook";
    if (issuer.includes("apple")) return "apple";
    if (issuer.includes("microsoft") || issuer.includes("login.microsoftonline")) return "microsoft";
    if (issuer.includes("linkedin")) return "linkedin";
    if (issuer.includes("twitter") || issuer.includes("x.com") || issuer.includes("api.x.com")) return "twitter";
    if (issuer.includes("gitlab")) return "gitlab";
    if (issuer.includes("keycloak")) return "keycloak";
    if (issuer.includes("okta")) return "okta";

    if (name.includes("google")) return "google";
    if (name.includes("github")) return "github";
    if (name.includes("facebook")) return "facebook";
    if (name.includes("apple")) return "apple";
    if (name.includes("microsoft") || name.includes("azure")) return "microsoft";
    if (name.includes("linkedin")) return "linkedin";
    if (name.includes("twitter") || name.includes("x")) return "twitter";
    if (name.includes("gitlab")) return "gitlab";
    if (name.includes("keycloak")) return "keycloak";
    if (name.includes("okta")) return "okta";

    return "generic";
}

function ProviderIcon({ provider }: { provider: PublicOAuthProvider }) {
    const key = getProviderKey(provider);
    const common = "w-4 h-4";
    switch (key) {
        case "google":
            return (
                <svg className={common} viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.731 32.091 29.267 35 24 35c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.313 0 6.313 1.246 8.59 3.286l5.657-5.657C34.6 3.042 29.6 1 24 1 11.85 1 2 10.85 2 23s9.85 22 22 22 22-9.85 22-22c0-1.474-.154-2.912-.389-4.917z"/>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.467 16.246 18.848 13 24 13c3.313 0 6.313 1.246 8.59 3.286l5.657-5.657C34.6 3.042 29.6 1 24 1 15.64 1 8.538 5.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 45c5.177 0 9.9-1.977 13.444-5.182l-6.2-5.238C29.018 36.59 26.641 37 24 37c-5.239 0-9.715-3.005-11.874-7.356l-6.548 5.045C8.77 40.568 15.86 45 24 45z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.348 3.091-4.713 7-11.303 7-5.239 0-9.715-3.005-11.874-7.356l-6.548 5.045C8.77 40.568 15.86 45 24 45c12.15 0 22-9.85 22-22 0-1.474-.154-2.912-.389-4.917z"/>
                </svg>
            );
        case "github":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .5a12 12 0 0 0-3.792 23.4c.6.111.82-.261.82-.58 0-.287-.01-1.052-.016-2.066-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.204.085 1.838 1.236 1.838 1.236 1.07 1.834 2.806 1.304 3.49.997.108-.775.419-1.304.762-1.604-2.665-.304-5.466-1.333-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.221 0 4.61-2.804 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.605-.014 2.897-.014 3.293 0 .322.217.697.826.579A12 12 0 0 0 12 .5z"/>
                </svg>
            );
        case "facebook":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.796.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.59l-.467 3.622h-3.123V24h6.127C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
                </svg>
            );
        case "apple":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16.365 1.43c0 1.14-.455 2.21-1.192 3.004-.76.82-1.995 1.454-3.05 1.41-.135-1.1.504-2.25 1.233-3.052.76-.83 2.08-1.45 3.01-1.362zM20.24 17.548c-.56 1.315-.83 1.902-1.55 3.07-.99 1.6-2.385 3.6-4.1 3.616-1.533.015-1.93-.957-4.01-.957-2.08 0-2.523.93-4.06.972-1.74.032-3.07-1.74-4.07-3.334-2.22-3.463-3.91-9.77-1.64-14.06C1.88 5.05 3.64 3.88 5.63 3.85c1.597-.026 3.11 1.06 4.01 1.06.9 0 2.77-1.31 4.67-1.12.796.033 3.036.32 4.47 2.42-3.81 2.07-3.2 7.45.46 9.338z"/>
                </svg>
            );
        case "microsoft":
            return (
                <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
                    <rect width="10.5" height="10.5" x="1" y="1" fill="#F35325"/>
                    <rect width="10.5" height="10.5" x="12.5" y="1" fill="#81BC06"/>
                    <rect width="10.5" height="10.5" x="1" y="12.5" fill="#05A6F0"/>
                    <rect width="10.5" height="10.5" x="12.5" y="12.5" fill="#FFBA08"/>
                </svg>
            );
        case "linkedin":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554V14.86c0-1.333-.027-3.047-1.858-3.047-1.86 0-2.144 1.45-2.144 2.948v5.69H9.337V9h3.414v1.561h.047c.476-.9 1.64-1.85 3.373-1.85 3.608 0 4.272 2.375 4.272 5.462v6.279zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.988 20.452H3.687V9h3.301v11.452z"/>
                </svg>
            );
        case "twitter":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.608 1.794-1.571 2.163-2.723-.949.564-2.003.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.72 0-4.924 2.204-4.924 4.923 0 .386.045.762.128 1.124-4.092-.205-7.72-2.166-10.148-5.144-.425.729-.666 1.577-.666 2.476 0 1.708.87 3.216 2.19 4.099-.807-.026-1.566-.247-2.23-.616v.062c0 2.385 1.696 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.929-.086.627 1.956 2.444 3.381 4.6 3.421-1.685 1.322-3.808 2.11-6.115 2.11-.397 0-.788-.023-1.174-.068 2.179 1.397 4.768 2.214 7.557 2.214 9.054 0 14.01-7.503 14.01-14.01 0-.213-.004-.425-.014-.636.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
            );
        case "gitlab":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="#FC6D26" aria-hidden="true">
                    <path d="M22.65 13.4l-1.13-3.48-2.1-6.47c-.15-.47-.81-.47-.96 0l-2.1 6.47H7.65L5.55 3.45c-.15-.47-.81-.47-.96 0L2.49 9.92l-1.14 3.48c-.13.41.01.86.36 1.12L12 22.5l9.29-7.98c.35-.26.49-.71.36-1.12z"/>
                </svg>
            );
        case "keycloak":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="#6A6DCD" aria-hidden="true">
                    <path d="M2 7l5-3h10l5 3v10l-5 3H7l-5-3V7zm5.5 1L4 9.5V14l3.5 1.5L12 13V9l-4.5-1zM20 9.5L16.5 8 12 9v4l4.5 2L20 14V9.5z"/>
                </svg>
            );
        case "okta":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="#007DC1" aria-hidden="true">
                    <circle cx="12" cy="12" r="9"/>
                </svg>
            );
        default:
            return (
                <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14zm0 2a5 5 0 100 10 5 5 0 000-10z"/>
                </svg>
            );
    }
}

export const OAuthButtons: React.FC<{
    providers: PublicOAuthProvider[];
    onLogin: (provider: OAuthProvider) => void;
    label: string;
}> = ({providers, onLogin, label}) => {
    const { t } = useTranslation();
    return (
        <>
            <hr className="my-6"/>
            <p className="text-center text-sm text-gray-600 mb-3">
                {label}
            </p>
            <div className="flex flex-col gap-3">
                {providers.map((p) => {
                    const providerName = p.displayName
                        ? p.displayName.charAt(0).toUpperCase() + p.displayName.slice(1)
                        : "";
                    const buttonLabel = t("authen.continueWith", { provider: providerName });
                    return (
                        <button
                            key={p.id}
                            type="button"
                            aria-label={buttonLabel}
                            onClick={() => onLogin(p)}
                            className="oauth-button relative py-3 px-6 border border-gray-300 rounded-lg flex justify-center items-center text-gray-800 font-medium text-sm bg-white shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        >
                          <span className="flex items-center space-x-2">
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-white/0">
                                <ProviderIcon provider={p} />
                              </span>
                              <span>
                                  {buttonLabel}
                              </span>
                          </span>
                        </button>
                    );
                })}
            </div>
        </>
    );
};
