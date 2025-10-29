"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import TotpModal from "@/components/Common/Modal/TotpModal";
import PasswordChangeModal from "@/components/ChangePasswordModal";

import { REQUEST_STATE } from "@/services/HttpService";
import { useHttpPost } from "@/hooks/api/http/useHttpPost";
import {useUserStore} from "@/store/useUserStore";

export default function AccountManagePage() {
    const { t } = useTranslation();
    const { user, setUser } = useUserStore();
    const [totpEnabled, setTotpEnabled] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTotpModal, setShowTotpModal] = useState(false);
    const [modalType, setModalType] = useState<"generate" | "remove">("generate");
    const [secretUrl, setSecretUrl] = useState<string>();

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        const enabled = !!user?.totp2faEnabled;
        setTotpEnabled(enabled);
    }, []);

    const { execute: generateTotpSecret } = useHttpPost("generateTotpSecret");
    const { execute: updateTotp } = useHttpPost("updateTotp");

    const handleTotpToggle = async () => {
        if (!totpEnabled) {
            setModalType("generate");
            setSecretUrl(undefined);

            const res = await generateTotpSecret({});
            if (res.state === REQUEST_STATE.SUCCESS) {
                setSecretUrl(res.data.totpSecretUrl);
                setShowTotpModal(true);
            } else {
                toast(t("accountManage.totpUnexpectedError"), { type: "error" });
            }
        } else {
            setModalType("remove");
            setShowTotpModal(true);
        }
    };

    // 🔹 Submit TOTP enable/disable
    const handleTotpSubmit = async (code: string): Promise<boolean> => {
        const res = await updateTotp({
            enabled: modalType === "generate",
            totpToken: code,
        });

        if (res.state === REQUEST_STATE.SUCCESS) {
            setTotpEnabled(modalType === "generate");
            setShowTotpModal(false);
            const prevUser = user ?? null;
            // snapshot old value
            const prev = user?.totp2faEnabled ?? true;

            // optimistic update to the store so all pages reflect immediately
            if (prevUser) {
                setUser({ ...prevUser, totp2faEnabled: !prev });
            }

            return true;
        } else {
            setError(t("accountManage.totpIncorrectCode"));
            return false;
        }
    };

    return (
        <div>
            {/* TOTP modal */}
            <TotpModal
                show={showTotpModal}
                onClose={() => {
                    setShowTotpModal(false);
                    setError("");
                }}
                onSubmit={handleTotpSubmit}
                error={error}
                type={modalType}
                secretUrl={modalType === "generate" ? secretUrl : undefined}
            />

            {/* Password modal */}
            <PasswordChangeModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />

            <div className="bg-white rounded-2xl shadow-md border border-border-primary p-6 space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-xl font-semibold text-black">
                        {t("accountManage.title")}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {t("accountManage.description")}
                    </p>
                </div>

                {/* TOTP 2FA Section */}
                <div className="border rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800">
                                {t("accountManage.totpTitle")}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {t("accountManage.totpDescription")}
                            </p>
                        </div>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={totpEnabled}
                                onChange={handleTotpToggle}
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors duration-200 relative">
                <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        totpEnabled ? "translate-x-5" : ""
                    }`}
                ></span>
                            </div>
                        </label>
                    </div>
                    <p className="text-xs text-gray-500">
                        {t("accountManage.totpStatus")}:{" "}
                        <span
                            className={`font-medium ${
                                totpEnabled ? "text-green-600" : "text-red-500"
                            }`}
                        >
              {totpEnabled
                  ? t("accountManage.totpEnabled")
                  : t("accountManage.totpDisabled")}
            </span>
                    </p>
                </div>

                {/* Set Password Section */}
                <div className="border rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        {t("accountManage.passwordTitle")}
                    </h3>
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 max-w-md">
                            {t("accountManage.passwordDescription")}
                        </p>
                        <button
                            className="text-primary px-4 py-2 rounded-lg hover:bg-blue-50 border border-blue-200 text-sm font-medium"
                            onClick={() => setShowPasswordModal(true)}
                        >
                            {t("accountManage.passwordButton")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
