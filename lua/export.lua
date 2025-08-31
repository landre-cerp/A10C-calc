-- Uncomment this to enable DCS-BIOS
-- dofile(lfs.writedir() .. [[Scripts\DCS-BIOS\BIOS.lua]])
-- Uncomment this to enable DCS-SRS
-- pcall(function()
--     local dcsSr = require('lfs');
--     dofile(dcsSr.writedir() ..
--                [[Mods\Services\DCS-SRS\Scripts\DCS-SimpleRadioStandalone.lua]]);
-- end, nil)
-- =================================================================================================
-- Data export script for DCS, version 1.2.
-- Copyright (C) 2006-2014, Eagle Dynamics.
-- See http://www.lua.org for Lua script system info
-- We recommend to use the LuaSocket addon (http://www.tecgraf.puc-rio.br/luasocket)
-- to use standard network protocols in Lua scripts.
-- LuaSocket 2.0 files (*.dll and *.lua) are supplied in the Scripts/LuaSocket folder
-- and in the installation folder of the DCS.
-- Expand the functionality of following functions for your external application needs.
-- Look into Saved Games\DCS\Logs\dcs.log for this script errors, please.
--[[
-- Uncomment if using Vector class from the Scripts\Vector.lua file
local lfs = require('lfs')
LUA_PATH = "?;?.lua;"..lfs.currentdir().."/Scripts/?.lua"
require 'Vector'
-- See the Scripts\Vector.lua file for Vector class details, please.
--]] local default_output_file = nil

function LuaExportStart()

    -- Works once just before mission start.
    -- Make initializations of your files or connections here.

    package.path = package.path .. ";" .. lfs.currentdir() .. "/LuaSocket/?.lua"
    package.cpath = package.cpath .. ";" .. lfs.currentdir() ..
                        "/LuaSocket/?.dll"
    socket = require("socket")
    host = "127.0.0.1"
    port = 31090
    c = socket.try(socket.connect(host, port)) -- connect to the listener socket
    c:setoption("tcp-nodelay", true) -- set immediate transmission mode

end

function LuaExportBeforeNextFrame()
    -- Works just before every simulation frame.

    -- Call Lo*() functions to set data to Lock On here
    -- For example:
    --	LoSetCommand(3, 0.25) -- rudder 0.25 right
    --	LoSetCommand(64) -- increase thrust

end

function LuaExportAfterNextFrame()
    -- Works just after every simulation frame.

    -- Call Lo*() functions to get data from Lock On here.
    -- For example:
    local t = LoGetModelTime()
    local engine = LoGetEngineInfo()

    local weapons = LoGetPayloadInfo()
    local message = ""
    if weapons then
        message = message ..
                      string.format("Rounds = %d \n", weapons.Cannon.shells)

        for i_st, st in pairs(weapons.Stations) do

            message = message .. string.format("station %d : ", i_st)

            if (st.count ~= 0) then

                local name = LoGetNameByType(st.weapon.level1, st.weapon.level2,
                                             st.weapon.level3, st.weapon.level4)
                if name then
                    message = message ..
                                  string.format("%d x %s\n", st.count, name)
                else
                    message = message ..
                                  string.format("%d x  {%d,%d,%d,%d}\n",
                                                st.count, st.weapon.level1,
                                                st.weapon.level2,
                                                st.weapon.level3,
                                                st.weapon.level4)
                end
            else
                message = message .. "empty\n"
            end
        end
    end

    message = message .. string.format(
                  "RPM Left=%.1f Right=%.1f\nFuel internal=%.2f \nFuel external=%.2f \n",
                  engine.RPM.left, engine.RPM.right, engine.fuel_internal,
                  engine.fuel_external)

    socket.try(c:send(message))

end

function LuaExportStop()
    -- Works once just after mission stop.
    -- Close files and/or connections here.

    socket.try(c:send("quit")) -- to close the listener socket
    c:close()
end

function LuaExportActivityNextEvent(t) local tNext = t end
