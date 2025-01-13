import HairService from "../Models/HairService";
import users, { find } from "../Models/users";

export async function CreateHairService(req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;

    if (!name || !price || !description) {
        return res.status(400).json({
            "message": "Campos em falta!",
            "code": 0
        });
    }

    const userId = req.userId;

    const usersData = await users.findById(userId, {
        entityConnected: true
    });

    const HairServiceCreated = await HairService.create({
        name,
        price,
        photo,
        description,
        hairdresser: usersData.entityConnected,
        status: true
    });

    res.status(200).json({
        "message": "Serviço criado com sucesso!",
        "code": 2,
        "hairserviceId": HairServiceCreated._id
    });
}

export async function  GetHairService(req, res) {
    const hairserviceId = req.params.hairserviceid;

    if(!hairserviceId){
        return res.status(400).json({
            "message": "Campos em falta!"
        });
    }

    HairService.findById(hairserviceId).then((hairservice) => {
       res.status(200).json(hairservice); 
            
});
}

export async function GetAllHairServices(req, res) {
    const userId = req.userId;

    const usersData = await users.findById(userId, {
        entityConnected: true
    });

    HairService.find({hairdresser: usersData.entityConnected, status: true}, {
        description: true,
        name: true,
        photo: true,
        price: true    
    }).then((findHairServices) => {
        res.status(200).json(findHairServices);
    }).catch(() => {
        res.status(404).json({
            "message": "Nenhum serviço encontrado!",
            "code": 1
        });
        });
}

export async function UpdateHairServicePhoto(req, res) {
    try {
        await HairService.updateOne({
            _id: req.params.hairserviceid
        }, {
            photo: req.fileName
        })
        res.status(200).json({
            "message": "Foto do serviço atualizada com sucesso!",
            "code": 1,
            "fileName": req.fileName
        });
    }catch(e){
        res.status(400).json({
            "message": "Erro ao atualizar a foto do serviço!",
            "code": 1
        });
    }
}

export async function UpdateHairService(req, res) {
    const hairserviceId = req.params.hairserviceid;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;

    if (!name || !price || !description) {
        return res.status(400).json({
            "message": "Campos em falta!"
        });
    }

    try {
        await HairService.updateOne({
            name,
            price,
            description
        });

        res.status(200).json({
            "message": "Serviço atualizado com sucesso!",
            "code": 1
        });
    }catch(e){
        res.status(400).json({
            "message": "Erro ao atualizar o serviço!",
            "code": 1
        });
    }
}

export async function DeleteHairService(req, res) {
    const hairserviceId = req.params.hairserviceid;

    await HairService.updateOne({_id: hairserviceId}, {
        status: false
    });

    res.status(200).json({
        "message": "Serviço eliminado com sucesso!",
        "code": 2
    });
}
