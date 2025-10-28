import {useTranslation} from "react-i18next";

const TermsAndCondition = () => {
  const {t} = useTranslation();
  return (
    <div className="mb-0 text-text-primary font-sans leading-[1.5]">
      <p className="text-[24px] text-center mb-[1.5rem] leading-[1.5] ">
        <strong>{t("terms.termsAndConditionsTitle")}</strong>
      </p>
      <ol className="mt-3 grid gap-2 pl-[48px] list-decimal">
        <li>
          <p className="mb-6 ">
            <strong>{t("terms.section1Title")}</strong>
          </p>
          <ul className="mt-3 grid gap-2 pl-[48px] list-disc">
            <li>
              {t("terms.definition1")} {t("terms.definition2")}{" "}
              {t("terms.definition3")} {t("terms.definition4")}
            </li>
            <li>{t("terms.definition5")}</li>
            <li>{t("terms.definition6")}</li>
            <li>
              {t("terms.definition7")} {t("terms.definition8")}
            </li>
            <li>{t("terms.definition9")}</li>
            <li>{t("terms.definition10")}</li>
            <li>{t("terms.definition11")}</li>
            <li>
              {t("terms.definition12")} {t("terms.definition13")}
            </li>
            <li>
              {t("terms.definition14")} {t("terms.definition15")}
            </li>
            <li>{t("terms.definition16")}</li>
            <li>
              {t("terms.definition17")} {t("terms.definition18")}
            </li>
            <li>
              {t("terms.definition19")} {t("terms.definition20")}{" "}
              {t("terms.definition21")}
            </li>
            <li>{t("terms.definition22")}</li>
            <li>
              {t("terms.definition23")} {t("terms.definition24")}
            </li>
            <li>
              {t("terms.definition25")} {t("terms.definition26")}{" "}
              {t("terms.definition27")}
            </li>
            <li>{t("terms.definition28")}</li>
            <li>{t("terms.definition29")}</li>
            <li>{t("terms.definition30")}</li>
            <li>{t("terms.definition31")}</li>
            <li>{t("terms.definition32")}</li>
          </ul>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section2Title")}</strong>
          </p>
          <p className="mb-6">{t("terms.generalTerms1")}</p>
          <p className="mb-6">
            {t("terms.generalTerms2")} {t("terms.generalTerms3")}
          </p>
          <p className="mb-6">
            {t("terms.generalTerms4")} {t("terms.generalTerms5")}
          </p>
          <p className="mb-6">
            {t("terms.generalTerms6")} {t("terms.generalTerms7")}
          </p>
          <p className="mb-6">
            {t("terms.generalTerms8")} {t("terms.generalTerms9")}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section3Title")}</strong>
          </p>
          <p className="mb-6">
            {t("terms.freelancerCommitment1")}
            {t("terms.freelancerCommitment2")}
          </p>
          <p className="mb-6">
            {t("terms.freelancerCommitment3")}
            {t("terms.freelancerCommitment4")}
          </p>
          <p className="mb-6">
            {t("terms.freelancerCommitment5")}
            {t("terms.freelancerCommitment6")}
          </p>
          <p className="mb-6">
            {t("terms.freelancerCommitment7")}
            {t("terms.freelancerCommitment8")}
          </p>
          <p className="mb-6">
            {t("terms.freelancerCommitment9")}
            {t("terms.freelancerCommitment10")}
          </p>
          <p className="mb-6">{t("terms.freelancerCommitment11")}</p>
          <p className="mb-6">{t("terms.freelancerCommitment12")}</p>
          <p className="mb-6">{t("terms.freelancerCommitment13")}</p>
          <p className="mb-6">{t("terms.freelancerCommitment14")}</p>
          <p className="mb-6">{t("terms.freelancerCommitment15")}</p>
          <p className="mb-6">{t("terms.freelancerCommitment16")}</p>
          <p className="mb-6">{t("terms.freelancerCommitment17")}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section4Title")}</strong>
          </p>
          <p className="mb-6">{t("terms.registration1")}</p>
          <p className="mb-6">
            {t("terms.registration2")} {t("terms.registration3")}
          </p>
          <p className="mb-6">{t("terms.registration4")}</p>
          <p className="mb-6">· {t("terms.registration5")}</p>
          <p className="mb-6">· {t("terms.registration6")}</p>
          <p className="mb-6">
            · {t("terms.registration7")} {t("terms.registration8")}
          </p>
          <p className="mb-6">
            · {t("terms.registration9")} {t("terms.registration10")}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section5Title")}</strong> {t("terms.project1")}{" "}
            {t("terms.project2")} {t("terms.project3")}
          </p>
          <p className="mb-6">
            {t("terms.project4")} {t("terms.project5")}
          </p>
          <p className="mb-6">
            {t("terms.project6")} {t("terms.project7")} {t("terms.project8")}
          </p>
          <p className="mb-6">
            {t("terms.project9")} {t("terms.project10")}
          </p>
          <p className="mb-6">
            {t("terms.project11")} {t("terms.project12")}
          </p>
          <p className="mb-6">
            {t("terms.project13")} {t("terms.project14")}
          </p>
          <p className="mb-6">
            {t("terms.project15")} {t("terms.project16")}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section6Title")}</strong>
          </p>
          <p className="mb-6">{t("terms.communication1")}</p>
          <p className="mb-6">{t("terms.communication2")}</p>
          <p className="mb-6">{t("terms.communication3")}</p>
          <p className="mb-6">{t("terms.communication4")}</p>
          <p className="mb-6">{t("terms.communication5")}</p>
          <p className="mb-6">{t("terms.communication6")}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section7Title")}</strong>
          </p>
          <p className="mb-6">{t("terms.fees1")}</p>
          <p className="mb-6">
            {t("terms.fees2")} {t("terms.fees3")}
          </p>
          <p className="mb-6">
            {t("terms.fees4")} {t("terms.fees5")}
          </p>
          <p className="mb-6">{t("terms.fees6")}</p>
          <p className="mb-6">
            {t("terms.fees7")} {t("terms.fees8")}
          </p>
          <p className="mb-6">{t("terms.fees9")}</p>
          <p className="mb-6">{t("terms.fees10")}</p>
          <p className="mb-6">{t("terms.fees11")}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section8Title")}</strong>
          </p>
          <p className="mb-6">
            {t("terms.coins1")} {t("terms.coins2")} {t("terms.coins3")}
          </p>
          <p className="mb-6">
            {t("terms.coins4")} {t("terms.coins5")} {t("terms.coins6")}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section9Title")}</strong>
          </p>
          <p className="mb-6">{t("terms.productService1")}</p>
          <p className="mb-6">
            {t("terms.productService2")} {t("terms.productService3")}
          </p>
          <p className="mb-6">{t("terms.productService4")}</p>
          <p className="mb-6">{t("terms.productService5")}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section10Title")}</strong>
          </p>
          <p className="mb-6">
            {t("terms.review1")} {t("terms.review2")}
          </p>
          <p className="mb-6">
            {t("terms.review3")} {t("terms.review4")}
          </p>
          <p className="mb-6">
            {t("terms.review5")} {t("terms.review6")}
          </p>
          <p className="mb-6">{t("terms.review7")}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section11Title")}</strong>
          </p>
          <p className="mb-6">{t("terms.projectStatus1")}</p>
          <p className="mb-6">{t("terms.projectStatus2")}</p>
          <p className="mb-6">{t("terms.projectStatus3")}</p>
          <p className="mb-6">{t("terms.projectStatus4")}</p>
          <p className="mb-6">{t("terms.projectStatus5")}</p>
          <p className="mb-6">{t("terms.projectStatus6")}</p>
        </li>
        <li>
          <p className="mb-6 ">
            <strong>{t("terms.section12Title")}</strong>
          </p>
          <p className="mb-6 ">{t("terms.cancellationRestrictions1")}</p>
          <p className="mb-6 ">{t("terms.cancellationRestrictions2")}</p>
          <p className="mb-6 ">{t("terms.cancellationRestrictions3")}</p>
          <p className="mb-6 ">{t("terms.cancellationRestrictions4")}</p>
        </li>
        <li>
          <p className="mb-6 ">
            <strong>{t("terms.section13Title")}</strong>
          </p>
          <p className="mb-6 ">{t("terms.accountSuspension1")}</p>
          <p className="mb-6 ">{t("terms.accountSuspension2")}</p>
          <p className="mb-6 ">{t("terms.accountSuspension3")}</p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>{t("terms.accountSuspension4")}</li>
            <li>{t("terms.accountSuspension5")}</li>
            <li>{t("terms.accountSuspension6")}</li>
            <li>{t("terms.accountSuspension7")}</li>
            <li>{t("terms.accountSuspension8")}</li>
            <li>{t("terms.accountSuspension9")}</li>
            <li>{t("terms.accountSuspension10")}</li>
            <li>{t("terms.accountSuspension11")}</li>
            <li>{t("terms.accountSuspension12")}</li>
          </ul>
          <p className="mb-6 ">{t("terms.accountSuspension13")}</p>
          <p className="mb-6 ">{t("terms.accountSuspension14")}</p>
          <p className="mb-6 ">{t("terms.accountSuspension15")}</p>
        </li>
        <li>
          <p className="mb-6 ">
            <strong>{t("terms.section14Title")}</strong>
          </p>
          <p className="mb-6 ">{t("terms.disputeResolution1")}</p>
          <p className="mb-6">{t("terms.disputeResolution2")}</p>
          <p className="mb-6">{t("terms.disputeResolution3")}</p>
          <p className="mb-6">{t("terms.disputeResolution4")}</p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>{t("terms.disputeResolution5")}</li>
            <li>{t("terms.disputeResolution6")}</li>
            <li>{t("terms.disputeResolution7")}</li>
            <li>{t("terms.disputeResolution8")}</li>
          </ul>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section15Title")}</strong>
          </p>
          <p className="mb-6">
            {t("terms.indemnification1")}
          </p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>
              {t("terms.indemnification2")}
            </li>
            <li>
              {t("terms.indemnification3")}
            </li>
            <li>
              {t("terms.indemnification4")}
            </li>
            <li>
              {t("terms.indemnification5")}
            </li>
          </ul>
          <p className="mb-6">
            {t("terms.indemnification6")}
          </p>
          <p className="mb-6">
            {t("terms.indemnification7")}
          </p>
          <p className="mb-6">
            {t("terms.indemnification8")}
          </p>
          <p className="mb-6">
            {t("terms.indemnification9")}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section16Title")}</strong>
          </p>
          <p className="mb-6">
            {t("terms.companyLiability1")}
          </p>
          <p className="mb-6">
            {t("terms.companyLiability2")}
          </p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>{t("terms.companyLiability3")}</li>
            <li>{t("terms.companyLiability4")}</li>
            <li>{t("terms.companyLiability5")}</li>
            <li>
              {t("terms.companyLiability6")}
            </li>
          </ul>
          <p className="mb-6">
            {t("terms.companyLiability7")}
          </p>
          <p className="mb-6">
            {t("terms.companyLiability8")}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section17Title")}</strong>
          </p>
          <p className="mb-6">
            {t("terms.intellectualProperty1")}
          </p>
          <p className="mb-6">
            {t("terms.intellectualProperty2")}
          </p>
          <p className="mb-6">
            {t("terms.intellectualProperty3")}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section18Title")}</strong>
          </p>
          <p className="mb-6">
            {t("terms.privacyPolicy1")}
          </p>
          <p className="mb-6">
            {t("terms.privacyPolicy2")}
          </p>
          <p className="mb-6">
            {t("terms.privacyPolicy3")}
          </p>
          <p className="mb-6">
            {t("terms.privacyPolicy4")}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{t("terms.section19Title")}</strong>
          </p>
          <p className="mb-6">
            {t("terms.contact1")}
          </p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>
              {t("terms.contact2")}
            </li>
            <li>
              {t("terms.contact3")}
            </li>
            <li>
              {t("terms.contact4")}
            </li>
            <li>
              {t("terms.contact5")}
            </li>
          </ul>
        </li>
      </ol>
    </div>
  );
};

export default TermsAndCondition;
