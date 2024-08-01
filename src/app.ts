import express, {Application, Request, Response, NextFunction} from 'express';
import http from "http";
import serverConfig from "./frameworks/webserver/server"
import connectDb from "./frameworks/database/connection";
import expressConfig from './frameworks/webserver/expressConfig';
import routes from "./frameworks/webserver/routes";
import { Server } from "socket.io";
import socketConfig from "./frameworks/webserver/webSocket/socket";
import errorHandlingMiddleware from "./frameworks/webserver/middlewares/errorHandlingMiddleware";
import CustomError from "./utils/customError";
import path from 'path'

const app: Application = express();

const server=http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // app.use(
  //   express.static(path.join(__dirname, "../../frontend/dist"))
  // );

socketConfig(io);
expressConfig(app)
connectDb();
routes(app);

// app.get("*", (req: Request, res: Response) => {
//   res.sendFile(
//     path.join(__dirname, "../../frontend/dist/index.html")
//   );
// });

serverConfig(server).startServer();

app.use(errorHandlingMiddleware);
app.all("*",(req, res, next: NextFunction)=>{
    next(new CustomError(`Not found : ${req.url}`, 404));
});