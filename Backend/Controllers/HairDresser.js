import HairDresser from "../Models/HairDresser";
import HairService from "../Models/HairService";
import users from "../Models/users";
import { CalcCrow, EmailValidation} from "../Utils/Functions";

export async GetAllCartFromHairdresser(req, res){
    const lat = req.body.lat;
    const long = req.body.long;

    if(!lat || !long){
        return res.status(400).json({
            "message": "Campos em falta!"
        });
    }

    const hairdresserNearBy = [];

    const allActiveHairDresser = HairDresser.find({
        isActived: true
    }, {
        name: true,
        photo: true,
        openstore: true,
        closestore: true,
        daysoff: true,
        rating: true,
        firstaddress: true,
        secondaddress: true,
        lat: true,
        long: true
    });

    allActiveHairDresser.forEach((hairdresser) => {
        const callDist = CalcCrow(lat, long, hairdresser.lat, hairdresser.long);
        if(callDist <= 5){
            hairdresserNearBy.push(hairdresser);
        }
});

res.status(200).json(hairdresserNearBy);
}

export async function GetAllHairDresser(req, res) {
    const allHairDresser = await HairDresser.find({}, {
        name: true,
        photo: true,
        openstore: true,
        closestore: true,
        daysoff: true,
        rating: true,
        firstaddress: true,
        secondaddress: true,
    });

    res.status(200).json(allHairDresser);
    
}

export async function CreateHairDresser(req, res){
    const name = req.body.name;
    const photo = req.body.photo;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const tax = req.body.tax;
    const observations = req.body.observations;
    const firstaddress = req.body.firstaddress;
    const secondaddress = req.body.secondaddress;
    const openstore = req.body.openstore;
    const closestore = req.body.closestore;
    const lat = req.body.lat;
    const long = req.body.long;
    const daysoff = req.body.daysoff;
    const rating = req.body.rating;

    if(!name || !photo || !email || !phonenumber || !tax || !firstaddress || !secondaddress || !openstore || !closestore || !lat || !long){
        return res.status(400).json({
            "message": "Campos em falta!",
            "code": 0
        });
    }

    if(!EmailValidation(email)){
        return res.status(400).json({
            "message": "Email inválido!",
            "code": 1
        });
    }

    

}