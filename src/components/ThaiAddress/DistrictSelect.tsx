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

export default function DistrictSelect({
                                           value,
                                           options,
                                           onChange,
                                           disabled,
                                           loading,
                                           placeholder = "— เลือกอำเภอ —",
                                           className,
                                           ...rest
                                       }: Props) {
    const mergedClassName = className
        ? `${className} w-full px-3 py-2 border rounded-md`
        : "w-full px-3 py-2 border rounded-md";
    return (
        <select
            className={mergedClassName}
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