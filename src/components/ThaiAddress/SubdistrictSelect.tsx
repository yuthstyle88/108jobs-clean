"use client";
import React from "react";
import type {Option} from "./ProvinceSelect";

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> & {
    value?: string;
    options: Option[];
    onChange: (v?: string) => void;
    disabled?: boolean;
    loading?: boolean;
    placeholder?: string;
    className?: string;
};

export default function SubdistrictSelect({
                                              value,
                                              options,
                                              onChange,
                                              disabled,
                                              loading,
                                              placeholder = "— เลือกตำบล —",
                                              className,
                                              ...rest
                                          }: Props) {
    return (
        <select
            className={"px-3 py-2 border rounded-md " + (className ?? "w-full")}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || undefined)}
            disabled={disabled}
            {...rest}
        >
            <option value="">{loading ? "Loading..." : placeholder}</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    );
}