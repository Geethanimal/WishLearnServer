import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { userRouter } from "./controllers/user.routes";
import { posterRouter } from "./controllers/poster.routes";
import { comntRouter } from "./controllers/comnt.routes";
import { online_classRouter } from "./controllers/online_class.routes";
import { Server } from "socket.io";
import http from 'http';

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const app = express();
const app1 = express();
const server = http.createServer(app1);
const io = new Server(server, { cors: { origin: "*" }, });

const corsOptions = {
    origin: 'http://localhost:4200/liveclass',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 200,
};


const ATLAS_URI = process.env.ATLAS_URI;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}

connectToDatabase(ATLAS_URI)
    .then(() => {

        app1.use(cors(corsOptions));
        app.use(cors());

        app.use("/users", userRouter);
        app.use("/posters", posterRouter);
        app.use("/comnts", comntRouter);
        app.use("/online_class", online_classRouter);

        io.on('connection', (socket) => {
            console.log('a user connected');


            socket.emit('Socket Connection', {
                greeting: 'Successful !'
            });

            socket.on('chat message', (msg, room) => {
                console.log('message: ' + msg + ' ' + room);
                io.to(room).emit('chat message', msg);
            });

            socket.on("join-room", (room, cb) => {
                socket.join(room)
                cb(`Joined ${room}`)
            })

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });

        });
        // start the Express server for Socket
        server.listen(5400, () => {
            console.log(`Socket Server running at http://localhost:5400...`);
        });

        // start the Express server
        app.listen(5300, () => {
            console.log(`Server running at http://localhost:5300...`);
        });

    })
    .catch(error => console.error(error));

export { app }