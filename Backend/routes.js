import express from 'express';

import {BasicAuth, Auth} from './middlewares/auth';



import { CreateHairService, DeleteHairService, GetAllHairServices, GetHairService, UpdateHairService, UpdateHairServicePhoto } from './Controllers/HairService';
import { GetAddress, GetAllAddress, CreateOrUpdateAddress, DeleteAddress } from './Controllers/Address';
import { CreateOrUpdateUser, DeleteUser, GetUser, Login, Logout } from './Controllers/user';


