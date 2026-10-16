"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function JewelrySelect({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  required = false,
  disabled = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((option) => option.value === value);
  const label = selected?.label || placeholder;

  useEffect(() => {
    const handleClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const choose = (nextValue) => {
    onChange({ target: { name, value: nextValue } });
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border bg-[#fffdf8] px-4 py-2.5 text-left text-sm outline-none transition ${
          open ? "border-[#b8873a] ring-1 ring-[#b8873a]" : "border-[#e4d2b3]"
        } ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-[#d4b57a]"} ${
          selected ? "text-[#2f2418]" : "text-[#b6a48a]"
        }`}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          size={16}
          className={`ml-2 shrink-0 text-[#a67c36] transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {required && (
        <input type="text" name={name} value={value || ""} required readOnly className="sr-only" tabIndex={-1} />
      )}

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-[#ecdfcb] bg-[#fffdf8] py-1.5 shadow-[0_18px_40px_-24px_rgba(86,54,19,0.45)]"
        >
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <li key={`${option.value}-${option.label}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => choose(option.value)}
                  className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "bg-[#f7edd8] font-medium text-[#2f2418]"
                      : "text-[#4a3a27] hover:bg-[#fbf4e8]"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
