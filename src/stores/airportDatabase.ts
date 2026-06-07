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
      const idx = this.airports.findIndex((a) => a.icao === airport.icao);
      if (idx !== -1) {
        this.airports[idx] = { ...airport };
        this._persist();
      }
    },

    deleteAirport(icao: string) {
      this.airports = this.airports.filter((a) => a.icao !== icao);
      this._persist();
    },

    exportToJson() {
      const blob = new Blob([JSON.stringify(this.airports, null, 2)], {
        type: 'application/json',
      });
      saveAs(blob, 'dcs-airports.json');
    },

    /** Import airports, replacing existing entries by ICAO code. Returns count imported. */
    importFromJson(data: SavedAirport[]): number {
      for (const airport of data) {
        const idx = this.airports.findIndex(
          (a) => a.icao && airport.icao && a.icao.toUpperCase() === airport.icao.toUpperCase(),
        );
        if (idx !== -1) {
          this.airports[idx] = { ...airport };
        } else {
          this.airports.push(airport);
        }
      }
      this._persist();
      return data.length;
    },
  },
});
