import { defineStore } from 'pinia';
import { saveAs } from 'file-saver';
import { SavedAirport } from 'src/service/AirportDatabase';

const STORAGE_KEY = 'dcs-airport-database';

export const useAirportDatabaseStore = defineStore('airportDatabase', {
  state: () => ({
    airports: [] as SavedAirport[],
  }),

  actions: {
    init() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          this.airports = JSON.parse(raw) as SavedAirport[];
        } catch {
          // ignore corrupted data
        }
      }
    },

    _persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.airports));
    },

    addAirport(airport: SavedAirport) {
      this.airports.push(airport);
      this._persist();
    },

    updateAirport(airport: SavedAirport) {
      const idx = this.airports.findIndex((a) => a.id === airport.id);
      if (idx !== -1) {
        this.airports[idx] = { ...airport };
        this._persist();
      }
    },

    deleteAirport(id: string) {
      this.airports = this.airports.filter((a) => a.id !== id);
      this._persist();
    },

    exportToJson() {
      const blob = new Blob([JSON.stringify(this.airports, null, 2)], {
        type: 'application/json',
      });
      saveAs(blob, 'dcs-airports.json');
    },

    /** Merge imported airports (skips duplicates by id). Returns count added. */
    importFromJson(data: SavedAirport[]): number {
      let added = 0;
      for (const airport of data) {
        if (!this.airports.find((a) => a.id === airport.id)) {
          this.airports.push(airport);
          added++;
        }
      }
      this._persist();
      return added;
    },
  },
});
