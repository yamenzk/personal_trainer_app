// src/components/onboarding/steps/NationalityStep.tsx
import { useState, useMemo, useEffect } from 'react';
import { Input, Button, ScrollShadow, Chip } from "@nextui-org/react";
import { Search, Globe, MapPin, SearchIcon } from 'lucide-react';
import countries from '../../../data/countries';

interface NationalityStepProps {
  onComplete: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: string;
}

const NationalityStep = ({ onComplete, onValidationChange, initialValue }: NationalityStepProps) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(initialValue || null);

  // Update validation state when selection changes
  useEffect(() => {
    onValidationChange?.(!!selected);
  }, [selected, onValidationChange]);

  const commonCountries = [
    'United Arab Emirates', 'Saudi Arabia', 'Egypt',
    'Syria', 'Iraq', 'Jordan', 'Lebanon', 'Palestine'
  ];

  const filteredCountries = useMemo(() => {
    if (!search) return [];
    return countries
      .filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 6); // Limit results for better performance
  }, [search]);

  const handleSelect = (country: string) => {
    setSelected(country);
    onComplete(country);
    setSearch(''); // Clear search after selection
  };

  // Initial validation on mount if there's an initial value
  useEffect(() => {
    if (initialValue) {
      handleSelect(initialValue);
    }
  }, [initialValue]);

  return (
    <div className="space-y-4">
      {/* Selected Country Display */}
      {selected && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary-500/10 border-2 border-primary-500">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-500" />
            <span className="font-medium">{selected}</span>
          </div>
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() => {
              setSelected(null);
              onValidationChange?.(false);
            }}
            className="px-3 py-1.5 rounded-md text-sm font-medium
                           bg-primary-500/10 hover:bg-primary-500/20
                           text-primary-700 dark:text-primary-300
                           border border-primary-500/20
                           transition-colors duration-150
                           flex items-center gap-1.5"
          >
            Change
          </Button>
        </div>
      )}

      {/* Search and Selection Area */}
      {!selected && (
        <div className="space-y-4">
          {/* Search Input */}
          <Input
            isClearable
            value={search}
            onValueChange={setSearch}
            radius="lg"
            autoFocus
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            placeholder="Type to search..."
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
          />

          {/* Quick Selection */}
          {!search && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground/60">Quick Select</p>
            <div className="flex flex-wrap gap-2">
              {commonCountries.map(country => (
                <button
                  key={country}
                  onClick={() => handleSelect(country)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium
                           bg-primary-500/10 hover:bg-primary-500/20
                           text-primary-700 dark:text-primary-300
                           border border-primary-500/20
                           transition-colors duration-150
                           flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {country}
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Search Results */}
          {search && filteredCountries.length > 0 && (
            <ScrollShadow className="max-h-[240px]">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground/60 mb-2">
                  Search Results
                </p>
                {filteredCountries.map(country => (
                  <button
                    key={country.code}
                    onClick={() => handleSelect(country.name)}
                    className="w-full p-3 rounded-lg flex items-center gap-3 
                             transition-colors text-foreground
                             hover:bg-content2 active:bg-content3"
                  >
                    <MapPin className="text-primary-500" size={18} />
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>
            </ScrollShadow>
          )}

          {/* No Results */}
          {search && filteredCountries.length === 0 && (
            <div className="text-center py-4 text-foreground/60">
              No countries found matching "{search}"
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="bg-content2 rounded-lg p-3">
        <div className="flex gap-2 items-start">
          <Globe className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/70">
            Your nationality helps me understand language preferences, marketing campaign effectiveness and reach.
          </p>
        </div>
      </div>

      {!selected && search.length === 0 && (
        <div className="text-center text-sm text-danger">
          Please select your nationality to continue
        </div>
      )}
    </div>
  );
};

export default NationalityStep;