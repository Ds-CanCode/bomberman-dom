import { getPlayer } from "../moduls/player.js";
import { Rooms } from "../moduls/room.js";

function checkerHandler(req, res) {
  const fullUrl = new URL(req.url, `http://${req.headers.host}`);
  const params = fullUrl.searchParams;
  const uuid = params.get("uuid");

  const player = getPlayer(uuid);

  if (player) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ player: player, nbr: player.Nbr, room: Rooms[player.JoinedRoom] }));
  } else {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid UUID or player not found" }));
  }
}

export default checkerHandler;
