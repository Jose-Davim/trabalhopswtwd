import express from 'express';
import routes from './routes';
import mongoose from 'mongoose';


const server = express();

mongoose.connect('mongodb+srv://scorpsgama:<Pipo4682e>@ucut.h6jc0.mongodb.net/');
server.use(express.json());
server.use(routes);
server.listenU(3000);