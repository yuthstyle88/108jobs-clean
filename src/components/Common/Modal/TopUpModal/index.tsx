import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faTimes} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {callHttp, isSuccess, REQUEST_STATE} from "@/services/HttpService";
import type {ScbQrCodeResponse, ScbTokenResponse} from "lemmy-js-client";
import LoadingMultiCircle from "@/components/Common/Loading/LoadingMultiCircle";

interface TopUpModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    selectedAmount: number | null;
}

const TopUpModal = ({
                        isModalOpen,
                        setIsModalOpen,
                        selectedAmount,
                    }: TopUpModalProps) => {
    const {t} = useTranslation();
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number>(300);
    const [qrId, setQrId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");
    const lastAmountRef = useRef<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const apiCheckRef = useRef<NodeJS.Timeout | null>(null);

    const canRequest = isModalOpen && typeof selectedAmount === "number" && selectedAmount > 0;

    // Format countdown time (MM:SS)
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // QR code generation
    useEffect(() => {
        if (!canRequest) {
            setQrImage(null);
            setError(null);
            setLoading(false);
            setPaymentStatus("pending");
            setQrId(null);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (apiCheckRef.current) {
                clearInterval(apiCheckRef.current);
                apiCheckRef.current = null;
            }
            return;
        }

        if (qrImage && lastAmountRef.current === selectedAmount) return;

        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                setQrImage(null);
                setPaymentStatus("pending");
                setCountdown(300);
                setQrId(null);

                const invoice = String(Math.floor(Date.now() / 1000));
                const body: Record<string, unknown> = {
                    qrType: "CS",
                    amount: String(selectedAmount ?? 0),
                    invoice,
                };
                const qrRes = await callHttp("createScbQrCode", {body});
                if (!isSuccess<ScbQrCodeResponse>(qrRes)) {
                    throw new Error((qrRes as any).err?.message || "Failed to create QR code");
                }

                const qrcodeId = qrRes.data?.data?.qrcodeId ?? null;
                if (!qrcodeId) {
                    setError("QR code ID not provided by the server");
                    setLoading(false);
                    return;
                }
                setQrId(qrcodeId);

                const raw = qrRes.data?.data?.qrImage;
                const img = typeof raw === "string"
                    ? (raw.startsWith("data:image") ? raw : `data:image/png;base64,${raw}`)
                    : null;
                if (!cancelled) {
                    setQrImage(img);
                    lastAmountRef.current = selectedAmount ?? null;

                    // Start countdown timer
                    timerRef.current = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                if (timerRef.current) {
                                    clearInterval(timerRef.current);
                                    timerRef.current = null;
                                }
                                if (apiCheckRef.current) {
                                    clearInterval(apiCheckRef.current);
                                    apiCheckRef.current = null;
                                }
                                setPaymentStatus("failed");
                                setError("stillDoNotPayYet");
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message || "Unexpected error");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (apiCheckRef.current) {
                clearInterval(apiCheckRef.current);
                apiCheckRef.current = null;
            }
        };
    }, [canRequest, selectedAmount, isModalOpen]);

    // QR status checking with dynamic frequency
    useEffect(() => {
        if (!qrId || paymentStatus !== "pending") return;

        const checkQrStatus = async () => {
            try {
                const inquiry = await callHttp("inquireScbQrCode", { qrId });
                if (inquiry.state === REQUEST_STATE.SUCCESS) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    if (apiCheckRef.current) {
                        clearInterval(apiCheckRef.current);
                        apiCheckRef.current = null;
                    }
                    setPaymentStatus("success");
                }
            } catch (e: any) {
                console.error(`QR status check failed for qrId ${qrId}:`, e.message);
            }
        };

        // run once immediately
        checkQrStatus();

        // decide interval time dynamically
        const intervalTime = countdown <= 5 ? 1000 : 10000;
        apiCheckRef.current = setInterval(checkQrStatus, intervalTime);

        return () => {
            if (apiCheckRef.current) {
                clearInterval(apiCheckRef.current);
                apiCheckRef.current = null;
            }
        };
    }, [qrId, paymentStatus, countdown]);

    // Log qrId updates for debugging
    useEffect(() => {
        if (qrId !== null) {
            console.log(`qrId updated to: ${qrId}`);
        }
    }, [qrId]);

    if (!isModalOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
            <div
                className="bg-white rounded-2xl max-w-md w-full mx-4 relative overflow-hidden shadow-2xl transform transition-all duration-300 ease-in-out scale-100 hover:scale-[1.02]">
                {/* Gradient Header */}
                <div className="bg-gradient-to-r coin-gradient p-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                        {t("profileCoins.topupModalTitle")}
                    </h3>
                    <button
                        className="text-white hover:text-gray-200 transition-colors duration-200"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="Close modal"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-2xl"/>
                    </button>
                </div>
                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Amount Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm font-medium">{t("profileCoins.labelAmountToTopUp")}</p>
                        <p className="text-2xl font-bold text-primary">
                            {selectedAmount?.toLocaleString()} <FontAwesomeIcon
                            icon={faCoins}
                            className="text-2xl text-yellow-500 transition-transform hover:scale-110"
                        />
                        </p>
                    </div>

                    {/* Countdown Timer */}
                    {paymentStatus === "pending" && qrImage && (
                        <div className="text-center text-gray-700 text-sm font-medium">
                            Time remaining: {formatTime(countdown)}
                        </div>
                    )}

                    {/* QR Code or Status Section */}
                    <div className="rounded-lg p-4 border border-gray-100 bg-gray-50">
                        {paymentStatus === "success" ? (
                            <div className="text-green-600 text-center">
                                {t("profileCoins.topUpSuccessMessage")}
                            </div>
                        ) : paymentStatus === "failed" ? (
                            <div className="text-sm text-red-600 text-center">
                                {t(`profileCoins.${error}`)}
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-700 text-sm font-medium mb-3">
                                    {t("profileCoins.scanQrToPay", {amount: selectedAmount?.toLocaleString()}) ||
                                        `Scan this QR code with your banking app to pay ${selectedAmount?.toLocaleString()} Coins`}
                                </p>
                                {loading && (
                                    <div className="flex justify-center items-center">
                                        <LoadingMultiCircle/>
                                    </div>
                                )}
                                {error && (
                                    <div className="text-sm text-red-600 text-center">

                                    </div>
                                )}
                                {!loading && !error && qrImage && (
                                    <img src={qrImage} alt="SCB QR Code"
                                         className="w-full h-56 object-contain bg-white rounded-lg shadow"/>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopUpModal;