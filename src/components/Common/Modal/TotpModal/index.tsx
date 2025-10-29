"use client";

import React, {useEffect, useRef, useState} from "react";
import Modal from "@/components/ui/Modal";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {QRCodeCanvas} from "qrcode.react";
import {useTranslation} from "react-i18next";

interface TotpModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (totp: string) => Promise<boolean>;
    type: "login" | "remove" | "generate";
    secretUrl?: string;
    error?: string | null;
}

const TOTP_LENGTH = 6;

export default function TotpModal({
                                      show,
                                      onClose,
                                      onSubmit,
                                      type,
                                      secretUrl,
                                      error
                                  }: TotpModalProps) {
    const {t} = useTranslation();
    const [totp, setTotp] = useState("");
    const [agreeChecked, setAgreeChecked] = useState(false);
    const [pending, setPending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset & focus input when modal opens
    useEffect(() => {
        if (show) {
            setTotp("");
            setAgreeChecked(false);
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [show]);

    const clearTotp = () => setTotp("");

    const handleSubmit = async (code: string) => {
        setPending(true);
        const ok = await onSubmit(code);
        setPending(false);

        if (!ok) {
            clearTotp();
            inputRef.current?.focus();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, TOTP_LENGTH);
        setTotp(value);
        if (value.length === TOTP_LENGTH && type !== "remove") {
            void handleSubmit(value);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").trim();

        if (!/^\d+$/.test(text) || text.length > TOTP_LENGTH) {
            toast.error(t("totp.invalidTotpCode"));
            clearTotp();
        } else {
            setTotp(text);
            if (text.length === TOTP_LENGTH) void handleSubmit(text);
        }
    };

    // Dynamic modal title
    const modalTitle = t(
        type === "generate"
            ? "totp.enableTotp"
            : type === "remove"
                ? "totp.disableTotp"
                : "totp.enterTotpCode"
    );

    return (
        <Modal
            isOpen={show}
            onClose={onClose}
            title={
                <span className="text-lg font-semibold text-gray-800">{modalTitle}</span>
            }
        >
            <div className="flex flex-col gap-6 text-gray-800 px-2">
                {/* === GENERATE MODE: QR + INSTRUCTIONS === */}
                {type === "generate" && secretUrl && (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="text-sm text-gray-600 space-y-3">
                            <p>{t("totp.totpSetupInstruction")}</p>

                            <p className="font-medium flex items-center justify-center gap-1">
                                {t("totp.recommendedApps")}
                            </p>

                            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                                <li>{t("totp.totpAppGoogle")}</li>
                                <li>{t("totp.totpAppAuthy")}</li>
                                <li>{t("totp.totpAppMicrosoft")}</li>
                                <li>{t("totp.totpAppPasswordMgr")}</li>
                            </ul>

                            <p className="text-xs text-gray-500 mt-2">
                                {t("totp.totpCodeRefresh")}
                            </p>
                        </div>

                        <a
                            href={secretUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-sm underline hover:text-blue-800"
                        >
                            {t("totp.openTotpLink")}
                        </a>

                        <div className="mt-2">
                            <p className="font-medium text-sm mb-2">
                                {t("totp.scanQrCode")}
                            </p>
                            <QRCodeCanvas value={secretUrl} size={180} className="mx-auto"/>
                        </div>

                    </div>
                )}

                {/* === TOTP INPUT FORM === */}
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (totp.length === TOTP_LENGTH) await handleSubmit(totp);
                    }}
                    className="flex flex-col gap-2 items-center"
                >
                    <label htmlFor="totp-input" className="text-sm font-medium">
                        {t("totp.enterTotpCodeLabel")}
                    </label>
                    <input
                        id="totp-input"
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={TOTP_LENGTH}
                        value={totp}
                        onChange={handleInput}
                        onPaste={handlePaste}
                        disabled={pending}
                        placeholder="xxxxxx"
                        className="text-center text-lg w-40 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                        required
                    />
                    {error && (
                        <p className="text-xs text-red-500">
                            {t(error)}
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {t("totp.totpHelpText")}
                    </p>
                </form>
                {type === "remove" && (
                    <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 p-3 rounded-md mt-2">
                        <p className="font-medium mb-1">{t("totp.reminderTitle", "Reminder")}</p>
                        <p>{t("totp.reminderRemoveOldApp", "After disabling 2FA, please remember to remove the old entry from your authenticator app.")}</p>

                        {/* I understand checkbox */}
                        <label className="flex items-center gap-2 mt-3">
                            <input
                                type="checkbox"
                                checked={agreeChecked}
                                onChange={(e) => setAgreeChecked(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-800">
                {t("totp.agreeDisableNotice", "I understand and want to disable two-factor authentication")}
            </span>
                        </label>
                    </div>
                )}

                {/* === ACTION BUTTONS === */}
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        type="submit"
                        onClick={async () => await handleSubmit(totp)}
                        disabled={
                            totp.length !== TOTP_LENGTH ||
                            pending ||
                            (type === "remove" && !agreeChecked)
                        }
                        className={`px-4 py-2 rounded-md text-white text-sm font-medium transition-colors ${
                            totp.length === TOTP_LENGTH &&
                            !pending &&
                            (type !== "remove" || agreeChecked)
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {pending ? t("totp.verifying") : t("totp.submit")}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            clearTotp();
                            onClose();
                        }}
                        className="px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        {t("totp.cancel")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}