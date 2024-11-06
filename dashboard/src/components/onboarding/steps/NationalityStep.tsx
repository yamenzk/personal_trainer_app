// src/components/onboarding/steps/NationalityStep.tsx
import { useState, useMemo } from 'react';
import { Input, Button, ScrollShadow } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, MapPin } from 'lucide-react';
import countries from '../../../data/countries';

interface NationalityStepProps {
  onComplete: (value: string) => void;
  isLoading?: boolean;
}

const NationalityStep = ({ onComplete, isLoading = false }: NationalityStepProps) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState('');

  const filteredCountries = useMemo(() => {
    return countries.filter(country => 
      country.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const commonCountries = [
    'United Arab Emirates', 'Saudi Arabia', 'Egypt', 
    'Syria', 'Iraq', 'Jordan', 'India'
  ];

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your nationality');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <Input
        type="text"
        label="Search Countries"
        value={search}
        onValueChange={setSearch}
        startContent={<Search className="text-default-400" size={18} />}
        classNames={{
          label: "text-foreground/90",
          input: [
            "bg-transparent",
            "text-foreground/90",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-sm",
            "bg-content/10",
            "backdrop-blur-sm",
            "hover:bg-content/20",
            "group-data-[focused=true]:bg-content/20",
          ],
        }}
      />

      {/* Common Countries */}
      {!search && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground/60">Trending Choices</h3>
          <div className="flex flex-wrap gap-2">
            {commonCountries.map(country => (
              <Button
                key={country}
                size="sm"
                variant={selected === country ? "solid" : "flat"}
                color={selected === country ? "primary" : "default"}
                className={selected === country ? "bg-primary-500" : "bg-content/5"}
                startContent={<Globe size={14} />}
                onPress={() => setSelected(country)}
              >
                {country}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Countries List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground/60">
          {search ? 'Search Results' : 'All Countries'}
        </h3>
        <ScrollShadow className="max-h-64">
          <div className="space-y-2">
            {filteredCountries.map(country => (
              <motion.button
                key={country.code}
                onClick={() => setSelected(country.name)}
                className={`
                  w-full p-3 rounded-lg flex items-center gap-3 transition-all duration-300
                  ${selected === country.name 
                    ? 'bg-primary-500/20 border border-primary-500' 
                    : 'bg-content/5 hover:bg-content/10'
                  }
                `}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <MapPin 
                  className={selected === country.name ? 'text-primary-500' : 'text-foreground/60'}
                  size={18} 
                />
                <span>{country.name}</span>
              </motion.button>
            ))}
          </div>
        </ScrollShadow>
      </div>

      {error && (
        <p className="text-danger text-sm text-center">{error}</p>
      )}

      <Button
        color="primary"
        size="lg"
        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500"
        onPress={handleSubmit}
        isLoading={isLoading}
      >
        Continue
      </Button>
    </div>
  );
};

export default NationalityStep;