import express from 'express';

import {BasicAuth, Auth} from './middlewares/auth';



import { CreateHairService, DeleteHairService, GetAllHairServices, GetHairService, UpdateHairService, UpdateHairServicePhoto } from './Controllers/HairService';
import { GetAddress, GetAllAddress, CreateOrUpdateAddress, DeleteAddress } from './Controllers/Address';
import { CreateOrUpdateUser, DeleteUser, GetUser, Login, Logout } from './Controllers/user';
import {GetAllCartFromHairdresser, GetAllHairDresser, CreateHairDresser, GetHairDresser, GetMyHairDresser, UpdateHairDresser, GetAllHairDresserNames, DeleteHairDresser, UpdateHairDresserPhoto} from './Controllers/HairDresser';
import {SaveReservation, GetAllCartFromUser, UpdateCartStatus, GetCartMetadata, UpdateCart, GetAllCartFromHairdresser, GetAllCarts} from './Controllers/ShopCart';

const routes = express.Router();

