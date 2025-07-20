import express from 'express';
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import ConnectToDB from './configs/mongoDB.js';

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import chatRouter from './routes/chat.routes.js';

const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(cors({
    origin: ["http://localhost:5173", "http://192.168.1.8:5173"],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send("API Running ..(🚀)..");
})

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/chat', chatRouter);


app.listen(PORT, async() => {
    console.log(`Server running is http://localhost:${PORT}`);
    await ConnectToDB();
});