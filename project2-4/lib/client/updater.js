import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
window.updateSocket = io();

window.updateSocket.on("cssChange", () => {
  let timestamp = `${new Date().getTime()}`;
  let links = document.querySelectorAll("link[rel=stylesheet]");
  for (const link of links) {
    let url = new URL(link.href);
    if (!url.host.includes("localhost")) continue;
    url.searchParams.delete("_ts");
    url.searchParams.append("_ts", timestamp);
    link.href = url.href;
  }
});

window.updateSocket.on("reload", () => {
  window.location.reload();
});
