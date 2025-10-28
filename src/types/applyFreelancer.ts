export type FreelancerFormData = {
  sourceTypes: string[];
  avatarUrl: string | null;
  username: string;
  displayName: string;
  bio: string;
  freelancerType: "Parttime" | "Fulltime";
  applyFee: boolean;
  birthDate: string;
  email: string;
  countryType: "Thailand" | "Foreign";
  country: string;

  cardNumber: string;
  cardAddressDetails: string;
  cardZipCode: string;
  cardSubdistrictOrDistrict: string;
  cardDistrictOrSubdistrict: string;
  cardProvince: string;

  frontCard: string | null;
  backCard: string | null;
  title: string;
  name: string;
  surname: string;
  addressDetails: string;
  province: string;
  subdistrictOrDistrict: string;
  districtOrSubdistrict: string;
  zipCode: string;
};
