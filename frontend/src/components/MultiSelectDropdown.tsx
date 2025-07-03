import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface MultiSelectDropdownProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedOptions,
  onChange,
  placeholder = "Select options...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    onChange(newSelectedOptions);
  };

  const handleRemoveOption = (option: string) => {
    const newSelectedOptions = selectedOptions.filter(
      (item) => item !== option
    );
    onChange(newSelectedOptions);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={handleToggle}
        className="w-full bg-white border border-gray-300 rounded-lg p-2 flex justify-between items-center cursor-pointer min-h-[50px]"
      >
        <div className="flex flex-wrap gap-2">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span
                key={option}
                className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-1 rounded-full flex items-center"
              >
                {option}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveOption(option);
                  }}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-500 px-2">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <ul className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  readOnly
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-3 text-sm text-gray-700">{option}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
