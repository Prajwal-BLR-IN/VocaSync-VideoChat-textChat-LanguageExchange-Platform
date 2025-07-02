import express from 'express';
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js';
import ConnectToDB from './configs/mongoDB.js';

const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cookieParser());

// cors, cookie-parser and express.json middlewares coming soon...

app.get('/', (req, res) => {
    res.send("API Running ..(🚀)..");
})

app.use('/api/auth', authRouter);


app.listen(PORT, async() => {
    console.log(`Server running is http://localhost:${PORT}`);
    await ConnectToDB();
});