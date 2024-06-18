import express, {Application, Request, Response, NextFunction} from 'express';
import http from "http";
import serverConfig from "./frameworks/webserver/server"
import connectDb from "./frameworks/database/connection";
import expressConfig from './frameworks/webserver/expressConfig';
import routes from "./frameworks/webserver/routes";


const app: Application = express();

const server=http.createServer(app);



expressConfig(app)

connectDb();
routes(app);

serverConfig(server).startServer();

