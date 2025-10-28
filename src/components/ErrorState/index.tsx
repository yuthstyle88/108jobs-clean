import {useTranslation} from 'react-i18next';

const ErrorState = () => {
    const { t } = useTranslation();

    return (
        <div className=" min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300 hover:shadow-2xl">
                <div className="mb-2">
                    <svg
                        className="w-16 h-16 text-red-500 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-red-600 mb-4">{t("global.failedToLoad")}</h2>
                <p className="text-gray-600 text-lg mb-8">{t("global.tryRefreshingPage")}</p>
            </div>
        </div>
    );
};

export default ErrorState;