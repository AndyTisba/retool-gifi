import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface DateInputProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateInput({
  value,
  onChange,
  placeholder = "ddmmyyyy",
  className,
}: DateInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");

  // Convertir une date en string dd/mm/yyyy
  const formatDateDisplay = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  // Initialiser l'affichage avec la valeur existante
  useEffect(() => {
    if (value && value instanceof Date && !isNaN(value.getTime())) {
      setDisplayValue(formatDateDisplay(value));
      setInputValue("");
    } else {
      setDisplayValue("");
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // Supprimer tout ce qui n'est pas un chiffre

    if (input.length <= 8) {
      setInputValue(input);

      if (input.length === 8) {
        // Parse ddmmyyyy
        const day = parseInt(input.substring(0, 2), 10);
        const month = parseInt(input.substring(2, 4), 10);
        const year = parseInt(input.substring(4, 8), 10);

        // Validation basique
        if (
          day >= 1 &&
          day <= 31 &&
          month >= 1 &&
          month <= 12 &&
          year >= 1900 &&
          year <= 2100
        ) {
          const date = new Date(year, month - 1, day);

          // Vérifier que la date est valide (ex: 31/02 n'existe pas)
          if (
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year
          ) {
            onChange(date);
            setDisplayValue(formatDateDisplay(date));
            setInputValue("");
          } else {
            // Date invalide, garder l'input pour correction
            onChange(undefined);
            setDisplayValue("");
          }
        } else {
          // Format invalide
          onChange(undefined);
          setDisplayValue("");
        }
      } else {
        // Input incomplet
        onChange(undefined);
        setDisplayValue("");
      }
    }
  };

  const handleFocus = () => {
    // Quand on focus, montrer la valeur brute pour édition
    if (value && value instanceof Date && !isNaN(value.getTime())) {
      const day = value.getDate().toString().padStart(2, "0");
      const month = (value.getMonth() + 1).toString().padStart(2, "0");
      const year = value.getFullYear().toString();
      setInputValue(`${day}${month}${year}`);
      setDisplayValue("");
    }
  };

  const handleBlur = () => {
    // Quand on perd le focus, revenir à l'affichage formaté
    if (value && value instanceof Date && !isNaN(value.getTime())) {
      setDisplayValue(formatDateDisplay(value));
      setInputValue("");
    } else if (inputValue.length > 0 && inputValue.length < 8) {
      // Si l'input est incomplet au blur, on le vide
      setInputValue("");
      setDisplayValue("");
      onChange(undefined);
    }
  };

  const displayText = displayValue || inputValue;
  const showPlaceholder = !displayText;

  return (
    <Input
      type="text"
      value={displayText}
      onChange={handleInputChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={showPlaceholder ? placeholder : ""}
      className={className}
      maxLength={10} // "dd/mm/yyyy" = 10 caractères
    />
  );
}
