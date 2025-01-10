import Users from "../Models/Users";
import Reservation from "../Models/ShopCart";
import Address from "../Models/Address";
import ReservationItems from "../Models/ShopCartItems";
import HairDresser from "../Models/HairDresser";

export async function SaveResvation(req, res) {
    const paymentMethod = req.body.paymentMethod;
    const observation = req.body.observation;
    const userId = req.body.userId;
    
}


