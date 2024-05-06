import { EventEnum } from "../types/EventEnum";
import { WebSocket } from "ws";

export const paidSuccess = (socket: WebSocket) => {
  socket.on("message", (data) => {
    console.log(data);

    socket.emit(EventEnum.paidSuccess, {
      data: JSON.stringify({ test: "pago" }),
    });
  });

  // socket.on(EventEnum.paidSuccess, (data) => {
  //   console.log(data);
  // });
};
