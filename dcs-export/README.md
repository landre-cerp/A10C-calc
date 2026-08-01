# DCS export script

This folder holds the DCS export script that feeds the **Live DCS data** card on the
[Take-Off page](../src/components/DcsLiveDataSync.vue) (Electron build only — a web browser
cannot receive UDP traffic). While parked at the runway, it lets you pull wind, altitude
and QNH straight from the sim instead of typing them in.

It sends wind, temperature, atmospheric pressure and aircraft position over UDP as JSON,
once every 0.1s, to `127.0.0.1:31090`. The app only acts on it when the reported aircraft is
an A-10C.

## Install

1. Copy the `wctrl-export/` folder into your DCS Saved Games Scripts folder, so you end up with:

   ```
   Saved Games\DCS\Scripts\wctrl-export\wctrl-export.lua
   Saved Games\DCS\Scripts\wctrl-export\wctrl-export-config.lua
   ```

   (`Saved Games\DCS` for the stable release, `Saved Games\DCS.openbeta` for open beta.)

2. Open (or create) `Saved Games\DCS\Scripts\Export.lua` and add:

   ```lua
   dofile(lfs.writedir() .. [[Scripts\wctrl-export\wctrl-export.lua]])
   ```

   If you already export other data (DCS-BIOS, Tacview, SRS, ...), just add this line
   alongside the existing `dofile(...)` calls — the script chains onto any previously
   installed `LuaExportStart` / `LuaExportAfterNextFrame` / `LuaExportStop` hooks instead of
   replacing them.

3. Start DCS. The A10C-calc Electron app listens on UDP port 31090 as soon as it launches —
   no need to start it before DCS.

Logs are written to `Saved Games\DCS\Logs\wctrl-export.log`.

## Configuration

`wctrl-export-config.lua` sets the destination address/port (default `127.0.0.1:31090`).
Only change the port here if you also change the matching constant in
[`src-electron/wctrl-export-server.ts`](../src-electron/wctrl-export-server.ts) — the two
must agree.

## Testing standalone

`test_client.py` is a small UDP listener that pretty-prints incoming packets, useful for
checking the export is working without running A10C-calc:

```bash
python test_client.py
```
