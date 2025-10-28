import {faChevronLeft, faChevronRight, faInfo, faRefresh,} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {useTranslation} from "react-i18next";

interface Props {
  data: Record<string, string>;
}

const TopUpHistory = () => {
    const {t} = useTranslation();
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-text-primary">
          {t("profileCoins.sectionTopUpHistory")}
        </h2>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FontAwesomeIcon
              icon={faRefresh}
              className="text-5 text-primary "
            />
          </button>
          <select
            className="border text-text-primary rounded-lg px-4 py-2 bg-white"
            defaultValue="2024"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
        <FontAwesomeIcon icon={faInfo} className="text-5 text-primary "/>
        <p className="text-blue-700">{t("profileCoins.noteBalanceUpdate")}</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-[800px] divide-y divide-gray-200">
          <thead className="bg-[#F6F7F8]">
          <tr className="text-center">
            <th className="py-4 px-4 text-left font-medium text-text-primary">
              {t("profileCoins.tablePaymentCode")}
            </th>
            <th className="py-4 px-4 text-left font-medium text-text-primary">
              {t("profileCoins.tableDateTransaction")}
            </th>
            <th className="py-4 px-4 text-left font-medium text-text-primary">
              {t("profileCoins.tableTopUpAmount")}
            </th>
            <th className="py-4 px-4 text-left font-medium text-text-primary">
              {t("profileCoins.tableSpecialBonus")}
            </th>
            <th className="py-4 px-4 text-left font-medium text-text-primary">
              {t("profileCoins.tableTotalCoins")}
            </th>
            <th className="py-4 px-4 text-left font-medium text-text-primary">
              {t("profileCoins.tablePaymentMethod")}
            </th>
            <th className="py-4 px-4 text-center font-medium text-text-primary">
              {t("profileCoins.tableStatus")}
            </th>
            <th className="py-4 px-4 text-left font-medium text-text-primary"></th>
          </tr>
          </thead>
          <tbody>
          <tr className="hover:bg-gray-50 text-[14px] text-text-primary font-sans">
            <td className="py-4 px-4">CQ94DJK</td>
            <td className="py-4 px-4">24/02/2025 22:15</td>
            <td className="py-4 px-4">233,232.00</td>
            <td className="py-4 px-4">0.00</td>
            <td className="py-4 px-4 font-medium">233,232.00</td>
            <td className="py-4 px-4">Promptpay</td>
            <td className="py-4 px-4">
              <div className="bg-[#F9EDC8] text-yellow-800 text-center py-2 px-6 rounded-full text-sm flex justify-center items-center">
                <span className="leading-[1]">{t("profileCoins.statusWaiting")}</span>
              </div>
            </td>
            <td className="py-4 px-4">
              <Link prefetch={false}
                    href="#"
                    className="text-primary hover:underline text-sm"
              >
                {t("profileCoins.statusWaiting")}
              </Link>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600">1 - 1 of 1 items</p>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            disabled
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="text-5 text-primary "
            />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white">
            1
          </button>
          <button
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            disabled
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-5 text-primary "
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUpHistory;
