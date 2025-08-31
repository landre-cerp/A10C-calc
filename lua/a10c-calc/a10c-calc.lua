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
--]] package.path = package.path .. ";" .. lfs.currentdir() ..
                        "/LuaSocket/?.lua"
package.cpath = package.cpath .. ";" .. lfs.currentdir() .. "/LuaSocket/?.dll"

package.path = lfs.writedir() .. "?.lua;" .. package.path

local M = {}
local A10CCalcConfig = require("Scripts.a10c-calc.a10c-calc-config")
local socket = require("socket") --[[@as Socket]]
local c = nil

-- Inline logger
local log_file_path = lfs.writedir() .. "Logs/a10c-calc.log"
local function log(msg, level)
    local f = io.open(log_file_path, "a")
    if f then
        f:write(os.date("[%Y-%m-%d %H:%M:%S] ") .. (level or "INFO") .. ": " ..
                    tostring(msg) .. "\n")
        f:close()
    end
end

function M.init()
    log("A10C Calc: init", "INFO")

    c = socket.try(socket.connect(A10CCalcConfig.tcp_config.address,
                                  A10CCalcConfig.tcp_config.port))
    if c then
        c:setoption("tcp-nodelay", true)
        log("A10C Calc: TCP connection established", "INFO")
    else
        log("A10C Calc: TCP connection failed", "ERROR")
    end
end

function M.update()
    -- Called every frame
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

    if c then local ok, err = socket.try(c:send(message)) end
end

function M.stop()
    -- Cleanup code here
    log("A10C Calc: stop", "INFO")
    if c then
        socket.try(c:send("quit"))
        c:close()
        log("A10C Calc: TCP connection closed", "INFO")
        c = nil
    end
end

-- Hook DCS export events directly in this module
function LuaExportStart() M.init() end

function LuaExportAfterNextFrame() M.update() end

function LuaExportStop() M.stop() end

return M
