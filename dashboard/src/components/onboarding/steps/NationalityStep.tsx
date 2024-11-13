import { useState, useMemo, useEffect } from 'react';
import { Card, CardBody, Input, ScrollShadow } from "@nextui-org/react";
import { Search, Globe, MapPin, Info, Check, X } from 'lucide-react';
import countries from '../../../data/countries';
import { NationalityStepProps } from '@/types';


const commonCountries = [
  'United Arab Emirates', 'Saudi Arabia', 'Egypt',
  'Syria', 'Iraq', 'Jordan', 'Lebanon', 'Palestine'
];

const NationalityStep = ({ onComplete, onValidationChange, initialValue }: NationalityStepProps) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(initialValue || null);

  useEffect(() => {
    onValidationChange?.(!!selected);
  }, [selected, onValidationChange]);

  const filteredCountries = useMemo(() => {
    if (!search) return [];
    return countries
      .filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 8);
  }, [search]);

  const handleSelect = (country: string) => {
    setSelected(country);
    onComplete(country);
    setSearch('');
  };

  return (
    <div className="space-y-4">
      {/* Selected Country Display */}
      {selected && (
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-primary-500/20 to-background flex items-center justify-center">
              <Globe className="w-7 h-7 text-primary-500" />
            </div>
            <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-base font-medium">{selected}</p>
            <button
              onClick={() => {
                setSelected(null);
                onValidationChange?.(false);
              }}
              className="mt-2 text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1 mx-auto"
            >
              <X className="w-3 h-3" /> Change
            </button>
          </div>
        </div>
      )}

      {/* Search and Selection Area */}
      {!selected && (
        <div className="space-y-3">
          {/* Search Input */}
          <Input
            isClearable
            value={search}
            onValueChange={setSearch}
            placeholder="Search countries..."
            variant="bordered"
            radius="lg"
            autoFocus
            startContent={
              <Search className="w-4 h-4 text-foreground/50" />
            }
          />

          {/* Quick Selection */}
          {!search && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground/60 px-1">Trending</p>
              <div className="grid grid-cols-2 gap-2">
                {commonCountries.map(country => (
                  <button
                    key={country}
                    onClick={() => handleSelect(country)}
                    className="p-2 rounded-lg bg-content1 hover:bg-content2 transition-colors
                             text-sm text-left flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span className="truncate">{country}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {search && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground/60 px-1">
                {filteredCountries.length > 0 ? 'Search Results' : 'No Results'}
              </p>
              <ScrollShadow className="max-h-[240px]">
                <div className="grid grid-cols-1 gap-1">
                  {filteredCountries.map(country => (
                    <button
                      key={country.code}
                      onClick={() => handleSelect(country.name)}
                      className="w-full p-2.5 rounded-lg flex items-center gap-3 
                               transition-colors text-foreground hover:bg-content2"
                    >
                      <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-sm">{country.name}</span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="text-center p-4 text-sm text-foreground/60 bg-content1 rounded-lg">
                      No countries found matching "{search}"
                    </div>
                  )}
                </div>
              </ScrollShadow>
            </div>
          )}
        </div>
      )}
      <Card className="bg-content2">
          <CardBody className="p-3">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">
              Your nationality helps me understand language preferences, marketing campaign effectiveness and reach.
              </p>
            </div>
          </CardBody>
        </Card>
    </div>
  );
};

export default NationalityStep;