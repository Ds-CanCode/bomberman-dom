import { board } from "./board.js";
import { Component } from "../../framework/component.js";
import { createVElement } from "../../framework/helpers.js";
import { StartGameLoop, StopGameLoop } from "../gameLoop/playerMovement.js";
import { INFO } from "../utils/playerStatus.js";
import { leaveRoom } from "../socket/startSocket.js";

export class Game extends Component {
  Mounting() {
    StartGameLoop(this.framework);
  }
  UnMounting() {
    StopGameLoop();
    if (INFO.socket) {
      INFO.socket.disconnect();
      INFO.socket = undefined;
    }
    this.framework.setWState("isWin", undefined);
    this.framework.setWState("live1", 3);
    this.framework.setWState("live2", 3);
    this.framework.setWState("live3", 3);
    this.framework.setWState("live4", 3);
  }
  getVDom() {
    return createVElement("div", { class: "game" }, [
      GameSideBar(this.framework),
      board(this.framework),
      GameStatus(this.framework),
    ]);
  }
}

function GameStatus(framework) {
  let isWin = framework.getState("isWin");
  if (isWin == undefined) {
    return createVElement("", {}, []);
  }

  let message = "YOU LOSE !!!";
  if (isWin == true) {
    message = "YOU WIN ???";
  }
  return createVElement("div", { class: "win" }, [
    createVElement("div", { class: "winPopUp" }, [
      createVElement("span", { class: "winMessage" }, [message]),
      createVElement(
        "div",
        {
          class: "backToHome",
          onclick: () => {
            INFO.Players = [];
            INFO.room = "";
            INFO.roomUuid = "";
            INFO.playerNbr = -1;
            framework.navigateTo("/start");
          },
        },
        ["Play Again"]
      ),
    ]),
  ]);
}

function GameSideBar(framework) {
  let PlayersVDom = [];

  let Players = framework.getState("Players");

  Players?.forEach((p, i) => {
    let live = framework.getState("live" + (i + 1).toString());
    PlayersVDom.push(
      createVElement("li", { class: "player_holder" }, [
        p.Nickname,
        createVElement("span", { class: "lives" }, [live.toString()]),
      ])
    );
  });

  return createVElement("div", { class: "sidebar" }, [
    createVElement("div", { class: "title" }, [
      "players",
      createVElement("div", { class: "players_holders" }, [
        createVElement("ul", { class: "players_list_holder" }, PlayersVDom),
      ]),
    ]),
  ]);
}
