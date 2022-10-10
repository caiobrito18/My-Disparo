export const websocket = new WebSocket("ws://localhost:8999");

websocket.onopen = () => console.log("connected");

export const connectionStatus = {
  0: "Connecting",
  1: "Open",
  3: "Closing",
  4: "Closed",
  5: "Uninstantiated"
}[websocket.readyState];
