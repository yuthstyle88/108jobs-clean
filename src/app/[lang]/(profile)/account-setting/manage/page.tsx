"use client";

import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import TotpModal from "@/components/Common/Modal/TotpModal";
import {toast} from "react-toastify";
import {HttpService, UserService} from "@/services";
import PasswordChangeModal from "@/components/ChangePasswordModal";

export default function AccountManagePage() {
    const {t} = useTranslation();
    const [totpEnabled, setTotpEnabled] = useState(false);
    const [showTotpModal, setShowTotpModal] = useState(false);
    const [modalType, setModalType] = useState<"generate" | "remove">("generate");
    const [secretUrl, setSecretUrl] = useState<string | undefined>();

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        const enabled =
            !!UserService.Instance.myUserInfo?.localUserView.localUser.totp2faEnabled;
        setTotpEnabled(enabled);
    }, []);

    const handleTotpToggle = async () => {
        if (!totpEnabled) {
            setModalType("generate");
            setSecretUrl(undefined);
            try {
                const res = await HttpService.client.generateTotpSecret();
                if (res.state === "success") {
                    setSecretUrl(res.data.totpSecretUrl);
                    setShowTotpModal(true);
                }
            } catch {
                toast(t("accountManage.totpUnexpectedError"), {type: "error"});
            }
        } else {
            setModalType("remove");
            setShowTotpModal(true);
        }
    };

    const handleTotpSubmit = async (code: string): Promise<boolean> => {
        try {
            const res = await HttpService.client.updateTotp({
                enabled: modalType === "generate",
                totpToken: code,
            });

            if (res.state === "success") {
                setTotpEnabled(modalType === "generate");
                setShowTotpModal(false);
                toast(
                    modalType === "generate"
                        ? t("accountManage.totpSuccessEnable")
                        : t("accountManage.totpSuccessDisable"),
                    {type: "success"}
                );

                const siteRes = await HttpService.client.getSite();
                if (siteRes.state === "success") {
                    UserService.Instance.myUserInfo!.localUserView.localUser.totp2faEnabled =
                        modalType === "generate";
                }
                return true;
            } else {
                toast(t("accountManage.totpIncorrectCode"), {type: "error"});
                return false;
            }
        } catch {
            toast(t("accountManage.totpError"), {type: "error"});
            return false;
        }
    };

    return (
        <div>
            {/* TOTP modal */}
            <TotpModal
                show={showTotpModal}
                onClose={() => setShowTotpModal(false)}
                onSubmit={handleTotpSubmit}
                type={modalType}
                secretUrl={modalType === "generate" ? secretUrl : undefined}
            />

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
                            <div
                                className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors duration-200 relative">
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
