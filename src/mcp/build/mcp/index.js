import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TakeoffIndexCalculator } from "../modules/a10c/takeoff/TakeOffIndex.js";
// Create server instance
const server = new McpServer({
    name: "a10c-calc",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
server.tool("getTakeoffIndex", "Get the takeoff index for the A10C, highest index is best", {
    altitude: z.number().describe("Pressure altitude in feet"),
    temperature: z.number().describe("Temperature in Celsius"),
}, async ({ altitude, temperature }) => {
    const calculator = new TakeoffIndexCalculator();
    const takeoffIndex = calculator.Calc(altitude, temperature);
    return {
        content: [
            {
                type: "text",
                text: takeoffIndex.toFixed(2),
            },
        ],
    };
});
server.tool("getTakeoffIndexRange", "Get the takeoff index for the A10C for range of altitudes and temperatures, highest index is best, use 100ft default steps, 10C default steps, returns a json [alt][temp]=index", {
    altitudemin: z.number().describe("Pressure altitude in feet"),
    altitudemax: z.number().describe("Pressure altitude in feet"),
    altitudestep: z.number().describe("Step between min and max altitude in feet"),
    temperaturemin: z.number().describe("Temperature in Celsius"),
    temperaturemax: z.number().describe("Temperature in Celsius"),
    temperaturestep: z.number().describe("Step between min and max temperature in Celsius"),
}, async ({ altitudemin, altitudemax, altitudestep, temperaturemin, temperaturemax, temperaturestep }) => {
    const calculator = new TakeoffIndexCalculator();
    let result = {};
    for (let alt = altitudemin; alt <= altitudemax; alt += altitudestep) {
        result[alt] = {}; // Initialise l'objet pour cette altitude
        for (let temp = temperaturemin; temp <= temperaturemax; temp += temperaturestep) {
            const takeoffIndex = calculator.Calc(alt, temp);
            result[alt][temp] = takeoffIndex.toFixed(2);
        }
    }
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(result, null, 2),
            },
        ],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("A10C  MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
