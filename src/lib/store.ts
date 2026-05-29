import { useState, useEffect } from "react";

export type ItemType = "event" | "mission";

export interface Attendee {
  id: string;
  discordName: string;
  characterName: string;
  registeredAt: string;
}

export interface EventOrMission {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  startDate: string;
  createdBy: "admin" | "professor";
  createdAt: string;
  attendees: Attendee[];
}

const STORAGE_KEY = "event_checker_items";

export function getItems(): EventOrMission[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveItems(items: EventOrMission[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("storage_change"));
}

export function useItems() {
  const [items, setItems] = useState<EventOrMission[]>(getItems());

  useEffect(() => {
    const handleStorageChange = () => {
      setItems(getItems());
    };
    window.addEventListener("storage_change", handleStorageChange);
    // Also listen to local storage change across tabs
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) {
        setItems(getItems());
      }
    });
    return () => {
      window.removeEventListener("storage_change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return items;
}
