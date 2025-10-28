"use client";
import React from "react";

export type Option = { value: string; label: string };

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> & {
    value?: string;
    options: Option[];
    onChange: (v?: string) => void;
    disabled?: boolean;
    loading?: boolean;
    placeholder?: string;
    className?: string;
};

export default function ProvinceSelect({
                                           value,
                                           options,
                                           onChange,
                                           disabled,
                                           loading,
                                           placeholder = "— เลือกจังหวัด —",
                                           className = "w-full px-3 py-2 border rounded-md",
                                           ...rest
                                       }: Props) {
    return (
        <select
            className={className}
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