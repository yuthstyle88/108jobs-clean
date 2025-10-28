"use client";

import React, {useEffect, useRef, useState} from "react";
import Modal from "@/components/ui/Modal";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {QRCodeCanvas} from "qrcode.react";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";

interface TotpModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (totp: string) => Promise<boolean>;
  type: "login" | "remove" | "generate";
  secretUrl?: string;
}

const TOTP_LENGTH = 6;

export default function TotpModal({
  show,
  onClose,
  onSubmit,
  type,
  secretUrl,
}: TotpModalProps) {
  const [totp, setTotp] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const authLanguage = getNamespace(LanguageFile.NOTIFICATION);

  useEffect(() => {
      if (show) {
        setTotp("");
        setTimeout(() => inputRef.current?.focus(),
          150);
      }
    },
    [show]);

  const clearTotp = () => {
    setTotp("");
  };

  const handleSubmit = async(code: string) => {
    setPending(true);
    const ok = await onSubmit(code);
    setPending(false);

    if (!ok) {
      toast.error(authLanguage.invalidCode);
      setTotp("");
      inputRef.current?.focus();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTotp(value);
      if (value.length >= TOTP_LENGTH) void handleSubmit(value);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(text) || text.length > TOTP_LENGTH) {
      toast.error(authLanguage.invalidTotpCode);
      clearTotp();
    } else {
      setTotp(text);
      if (text.length === TOTP_LENGTH) void handleSubmit(text);
    }
  };

  const modalTitle =
    type === "generate"
      ? "Enable TOTP"
      : type === "remove"
        ? "Disable TOTP"
        : "Enter TOTP Code";

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      title={<span className="text-lg font-semibold text-gray-800">{modalTitle}</span>}
    >
      <div className="flex flex-col gap-6 text-gray-800 px-2">
        {type === "generate" && secretUrl && (
          <div className="flex flex-col items-center gap-3 text-center">
            <a
              href={secretUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm underline hover:text-blue-800"
            >
              Open TOTP Setup Link
            </a>
            <div>
              <p className="font-medium text-sm mb-2">Scan QR Code with Authenticator App</p>
              <QRCodeCanvas value={secretUrl} size={180} className="mx-auto"/>
            </div>
          </div>
        )}

        <form
          onSubmit={async(e) => {
            e.preventDefault();
            if (totp.length === TOTP_LENGTH) await handleSubmit(totp);
          }}
          className="flex flex-col gap-2 items-center"
        >
          <label htmlFor="totp-input" className="text-sm font-medium">
            Enter TOTP Code
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
            className="text-center text-lg w-40 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="xxxxxx"
            required
          />
        </form>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="submit"
            onClick={async() => await handleSubmit(totp)}
            disabled={totp.length !== TOTP_LENGTH || pending}
            className={`px-4 py-2 rounded-md text-white text-sm font-medium transition-colors ${totp.length === TOTP_LENGTH && !pending
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {pending ? "Verifying..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
