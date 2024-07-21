import express from 'express'
import {config} from 'dotenv';
import { DBconnection } from './DB/connection.js';
import * as routers from './src/Modules/index.routes.js'
import { cronOne, cronTwo} from './src/utils/Crons.js';

config();

const app = express()
const port = +process.env.PORT

app.use(express.json());
DBconnection();

app.use('/uploads' , express.static('./Uploads'));
app.use('/user', routers.userRouter);
app.use('/msg', routers.messagesRouter);

app.all('*', (req , res , next)=>{  //or app.use
    res.status(404).send('<h3> 404 NOT FOUND </h3>')
})

app.use((err,req , res , next)=>{
    if(err){
        // cause --> carry status
        res.status(err['cause']||500).json({Message: err.message});
    }
})
cronOne();
cronTwo();


app.listen(port, () => console.log(`Example app listening on port ${port}!`))