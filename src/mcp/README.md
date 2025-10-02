# MCP Server

https://modelcontextprotocol.io/docs/develop/build-server

This was a quick test to add MCP server to Claude Desktop and have fun with the Lib

To do things like 
<img width="2001" height="1248" alt="image" src="https://github.com/user-attachments/assets/83368fe5-b90d-4405-b8ca-1021bc7c42b1" />

## Configure 

build the mcp server 
edit claude desktop config.json

{
  "mcpServers": {
    "a10c": {
      "command": "node",
      "args": ["C:\\Users\\Laurent\\Projects\\A10C-calc\\src\\mcp\\build\\mcp\\index.js"]
    }
  }
}

<img width="1149" height="610" alt="image" src="https://github.com/user-attachments/assets/e783000c-1c06-4efe-ae0a-78a11baa05ae" />
