import Users from "../Models/users";


export async function CreateService(req, res){
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;

    if(!name || !price || !description){
        return res.status(400).json({
            "message": "Missing fields! See API documentation"
        });
    }

    const userId = req.userId;

    const userData = await Users.findById(userId, {
        entityConnected: true
    });

    const ServiceCreated = await Service.create({
        description,
        name,
        price,
        Company: userData.entityConnected
    });

    res.status(200).json({
        "message": "Serviço criado com sucesso!",
        "code": 2,
        "ServiceId": ServiceCreated._id
    });
}

export async function GetService(req, res){
    const ServiceId = req.params.ServiceId;

    if(!ServiceId){
        return res.status(400).json({
            "message": "Missing field! See API documentation"
        });
    }

    Service.findById(ServiceId).then((ServiceItem) => {
        res.status(200).json(ServiceItem);
    });
}

export async function GetAllServices(req, res){
    const userId = req.userId;

    const userData = await Users.findById(userId, {
        entityConnected: true
    });

    Service.find({ Company: userData.entityConnected, status: true }, {
        description: true,
        name: true,
        price: true
    }).then((findServices) => {
        res.status(200).json(findServices);
    }).catch(() => {
        res.status(404).json({
            "message": "Service not found!",
            "code": 1
        });
    });
}


export async function UpdateService(req, res){
    const ServiceId = req.params.ServiceId;

    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;

    if(!ServiceId || !name || !price || !description){
        return res.status(400).json({
            "message": "Missing fields! See API documentation"
        });
    }

    await Service.updateOne({ _id: ServiceId }, {
        description,
        name,
        price
    });

    res.status(200).json({
        "message": "Service updated successfully!",
        "code": 2
    });
}

export async function DeleteService(req, res){
    const ServiceId = req.params.ServiceId;

    await Service.updateOne({ _id: ServiceId }, {
        status: false
    });

    res.status(200).json({
        "message": "Service deleted successfully!",
        "code": 2
    });
}