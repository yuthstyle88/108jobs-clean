"use client";
import {Badge} from "@/components/ui/Badge";
import {Clock, CheckCircle2, XCircle, Info} from "lucide-react";
import {useTranslation} from "react-i18next";

export const TopupGuide = () => {
    const {t} = useTranslation();

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600"/>
                <h2 className="text-lg font-bold text-blue-900">
                    {t("topupGuide.title")}
                </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
                {/* 1. Pending */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Clock className="w-3.5 h-3.5 mr-1"/>
                            {t("topupGuide.pending.badge")}
                        </Badge>
                        <span className="text-xs text-gray-500">{t("topupGuide.pending.step")}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                        {t("topupGuide.pending.title")}
                    </h3>
                    <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{__html: t("topupGuide.pending.description")}}
                    />
                    <ul className="mt-3 text-xs text-gray-600 space-y-1">
                        {(t("topupGuide.pending.list", { returnObjects: true }) as string[]).map((item, i) => (
                            <li key={i}>• {item}</li>
                        ))}
                    </ul>
                </div>

                {/* 2. Paid */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100 relative">
                    <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1"/>
                            {t("topupGuide.paid.badge")}
                        </Badge>
                        <span className="text-xs text-gray-500">{t("topupGuide.paid.step")}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                        {t("topupGuide.paid.title")}
                    </h3>
                    <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{__html: t("topupGuide.paid.description")}}
                    />
                    <ul className="mt-3 text-xs text-emerald-700 space-y-1">
                        {(t("topupGuide.paid.list", { returnObjects: true }) as string[]).map((item, i) => (
                            <li key={i}>• {item}</li>
                        ))}
                    </ul>
                </div>

                {/* 3. Expired */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-red-100">
                    <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                            <XCircle className="w-3.5 h-3.5 mr-1"/>
                            {t("topupGuide.expired.badge")}
                        </Badge>
                        <span className="text-xs text-gray-500">{t("topupGuide.expired.step")}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                        {t("topupGuide.expired.title")}
                    </h3>
                    <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{__html: t("topupGuide.expired.description")}}
                    />
                    <ul className="mt-3 text-xs text-red-700 space-y-1">
                        {(t("topupGuide.expired.list", { returnObjects: true }) as string[]).map((item, i) => (
                            <li key={i}>• {item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Flow Summary */}
            <div className="bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl p-5 mt-6">
                <h3 className="font-bold text-lg mb-2">
                    {t("topupGuide.workflow.title")}
                </h3>
                <p
                    className="text-sm opacity-90"
                    dangerouslySetInnerHTML={{__html: t("topupGuide.workflow.flow")}}
                />
            </div>

            <div className="text-xs text-gray-500 text-center mt-4">
                <p dangerouslySetInnerHTML={{__html: t("topupGuide.note")}}/>
            </div>
        </div>
    );
};