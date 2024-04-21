import React from "react";


// Example InputField component for simplification and reuse
export function InputField({
    label, id, type, placeholder, required, onChange, value, className
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className={`block mb-2 text-sm font-medium text-gray-900 dark:text-white ${className}`}
            >
                {label}
            </label>
            <input
                type={type}
                name={id}
                id={id}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={placeholder}
                required={required}
                onChange={onChange}
                value={value} />
        </div>
    );
}
