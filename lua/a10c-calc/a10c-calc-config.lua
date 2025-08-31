module("A10CCalcConfig", package.seeall)

--- @class TCPConnectionConfig
--- @field address string
--- @field port integer

--- @class A10CCalcConfig
--- @field tcp_config TCPConnectionConfig

local A10CCalcConfig = {tcp_config = {address = "127.0.0.1", port = 31090}}

return A10CCalcConfig
