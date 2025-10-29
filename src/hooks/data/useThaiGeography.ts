// Lightweight hooks to load Thai geography datasets from public/thai-geo/*
// Keep it UI-agnostic so you can place selects anywhere.

import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";

type Province = { code: string | number; nameTh?: string; nameEn?: string; provinceCode?: string | number };
type District = { districtCode: string | number; nameTh?: string; nameEn?: string; provinceCode?: string | number };
type Subdistrict = { subdistrictCode: string | number; nameTh?: string; nameEn?: string; districtCode?: string | number; postalCode?: string | number };

export type Option = { value: string; label: string };
const norm = (v: unknown) => String(v);

// Helpers to read flexible schemas (name fields / code fields may vary by dataset)
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const pick = (o: unknown, keys: string[]) => {
  if (!isObj(o)) return undefined;
  for (const k of keys) {
    const v = o[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

const labelENAny = (o: unknown) =>
  pick(o, [
    "nameEn",
    "name_en",
    "provinceNameEn",
    "districtNameEn",
    "amphoeNameEn",
    "subdistrictNameEn",
    "tambonNameEn",
    "en",
  ]);

const labelTHAny = (o: unknown) =>
  pick(o, [
    "nameTh",
    "name_th",
    "provinceNameTh",
    "districtNameTh",
    "amphoeNameTh",
    "subdistrictNameTh",
    "tambonNameTh",
    "th",
    "name",
  ]) ?? labelENAny(o);

const provinceCodeAny = (o: unknown) =>
  pick(o, ["provinceCode", "province_code", "code"]);
const districtCodeAny = (o: unknown) =>
  pick(o, ["districtCode", "district_code", "amphoeCode", "amphoe_code", "code"]);
const subdistrictCodeAny = (o: unknown) =>
  pick(o, ["subdistrictCode", "subdistrict_code", "tambonCode", "tambon_code", "code"]);

async function getJSON<T>(path: string): Promise<T> {
    const res = await fetch(path, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
}

// Load provinces once
export function useProvinces() {
    const { i18n } = useTranslation();
    const [data, setData] = useState<Province[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    useEffect(() => {
      let alive = true;
      (async () => {
        try {
          setLoading(true);
          const p = await getJSON<Province[]>("/thai-geo/provinces.json");
          if (alive) setData(p);
        } catch (e) {
          if (alive) setError(e);
        } finally {
          if (alive) setLoading(false);
        }
      })();
      return () => {
        alive = false;
      };
    }, []);

    const options: Option[] = useMemo(
        () => data.map(p => ({
            value: norm(provinceCodeAny(p)),
            label: String(i18n.language === "th" ? labelTHAny(p) : labelENAny(p) ?? "")
        })),
        [data, i18n.language]
    );

    return { options, loading, error, raw: data };
}

// Load districts for a given provinceCode
export function useDistricts(provinceCode?: string) {
    const { i18n } = useTranslation();
    const [data, setData] = useState<District[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
      let alive = true;
      setData([]);
      if (!provinceCode) return () => { alive = false; };
      (async () => {
        try {
          setLoading(true);
          const all = await getJSON<District[]>("/thai-geo/districts.json");
          if (!alive) return;
          const filtered = all.filter(d => {
            const pcode = provinceCodeAny(d) ?? String(districtCodeAny(d) ?? "").slice(0, 2);
            return norm(pcode) === norm(provinceCode);
          });
          if (alive) setData(filtered);
        } catch (e) {
          if (alive) setError(e);
        } finally {
          if (alive) setLoading(false);
        }
      })();
      return () => { alive = false; };
    }, [provinceCode]);

    const options: Option[] = useMemo(
        () => data.map(d => ({
            value: norm(districtCodeAny(d)),
            label: String(i18n.language === "th" ? labelTHAny(d) : labelENAny(d) ?? "")
        })),
        [data, i18n.language]
    );

    return { options, loading, error, raw: data };
}

// Load subdistricts for a given districtCode
export function useSubdistricts(districtCode?: string) {
    const { i18n } = useTranslation();
    const [data, setData] = useState<Subdistrict[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
      let alive = true;
      setData([]);
      if (!districtCode) return () => { alive = false; };
      (async () => {
        try {
          setLoading(true);
          const all = await getJSON<Subdistrict[]>("/thai-geo/subdistricts.json");
          if (!alive) return;
          const filtered = all.filter(s => {
            const dcode = districtCodeAny(s) ?? String(subdistrictCodeAny(s) ?? "").slice(0, 4);
            return norm(dcode) === norm(districtCode);
          });
          if (alive) setData(filtered);
        } catch (e) {
          if (alive) setError(e);
        } finally {
          if (alive) setLoading(false);
        }
      })();
      return () => { alive = false; };
    }, [districtCode]);

    const options: Option[] = useMemo(
        () => data.map(s => ({
            value: norm(subdistrictCodeAny(s)),
            label: String(i18n.language === "th" ? labelTHAny(s) : labelENAny(s) ?? "")
        })),
        [data, i18n.language]
    );

    return { options, loading, error, raw: data };
}