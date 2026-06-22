"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value?: string;
  placeholder?: string;
  onChange?: (v: string) => void;
  onSelect?: (address: string, latLng?: { lat: number; lng: number }) => void;
};

function loadGoogleMaps(apiKey: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject();
    if ((window as any).google && (window as any).google.maps) return resolve();

    const existing = document.querySelector(
      `script[data-src="google-maps"]`
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.dataset.src = "google-maps";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

export default function AddressAutocomplete({
  value = "",
  placeholder,
  onChange,
  onSelect,
}: Props) {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const serviceRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return;

    loadGoogleMaps(key)
      .then(() => {
        serviceRef.current = new (window as any).google.maps.places.AutocompleteService();
      })
      .catch(() => {
        console.warn("Failed to load Google Maps script for Places Autocomplete");
      });
  }, []);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const fetchPredictions = (inputValue: string) => {
    if (!serviceRef.current || !inputValue) {
      setSuggestions([]);
      return;
    }

    serviceRef.current.getPlacePredictions(
      { input: inputValue },
      (preds: any[]) => {
        setSuggestions(preds || []);
      }
    );
  };

  const handleChange = (v: string) => {
    setInput(v);
    onChange?.(v);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchPredictions(v), 250);
  };

  const geocodePlaceId = (placeId: string) => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!(window as any).google || !placeId) return reject();
      const geocoder = new (window as any).google.maps.Geocoder();
      geocoder.geocode({ placeId }, (results: any, status: string) => {
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          resolve({ lat: loc.lat(), lng: loc.lng() });
        } else {
          reject(status);
        }
      });
    });
  };

  const handleSelect = async (pred: any) => {
    const desc = pred.description;
    setInput(desc);
    setSuggestions([]);
    onChange?.(desc);
    if (pred.place_id) {
      try {
        const latLng = await geocodePlaceId(pred.place_id);
        onSelect?.(desc, latLng);
      } catch (e) {
        onSelect?.(desc);
      }
    } else {
      onSelect?.(desc);
    }
  };

  return (
    <div className="relative">
      <input
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 rounded-lg border border-gray-300 px-3"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 bg-white border rounded mt-1 max-h-60 overflow-auto">
          {suggestions.map((s) => (
            <li
              key={s.place_id || s.description}
              onClick={() => handleSelect(s)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
