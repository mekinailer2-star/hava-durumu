import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useSearchCities, getSearchCitiesQueryKey } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CitySearchProps = {
  onSelectCity: (lat: number, lon: number, name: string) => void;
  onLocateMe: () => void;
};

export function CitySearch({ onSelectCity, onLocateMe }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading } = useSearchCities(
    { q: debouncedQuery },
    {
      query: {
        enabled: debouncedQuery.length > 2,
        queryKey: getSearchCitiesQueryKey({ q: debouncedQuery }),
      },
    }
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto z-50" ref={containerRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Şehir ara..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-12 h-12 bg-background/50 backdrop-blur-md border-white/20 dark:border-white/10 shadow-lg rounded-2xl"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:bg-background/40 rounded-xl"
          onClick={onLocateMe}
          title="Konumumu Bul"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (query.length > 2) && (
        <div className="absolute top-full mt-2 w-full bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {isLoading ? (
            <div className="p-4 flex justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : searchResults?.results?.length ? (
            <ul className="max-h-[300px] overflow-y-auto p-2">
              {searchResults.results.map((city) => (
                <li key={`${city.id}-${city.latitude}`}>
                  <button
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-colors flex flex-col"
                    onClick={() => {
                      onSelectCity(city.latitude, city.longitude, city.name);
                      setIsOpen(false);
                      setQuery("");
                    }}
                  >
                    <span className="font-medium">{city.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Şehir bulunamadı
            </div>
          )}
        </div>
      )}
    </div>
  );
}
