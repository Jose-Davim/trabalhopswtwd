import Address from "../Models/Address";

export async function GetAllAddress(req, res) {
    let userId = req.params.userId;

    if (userId) {
        userId = req.userId;
    }

    Address.find({
        clientId: userId,
        status: true
    }).then((addressList) => {
        res.status(200).json(addressList);
    });

}

export async function CreateOrUpdateAddress(req, res) {
    const addressId = req.params.addressId;

    const firstaddress = req.body.firstaddress;
    const secondaddress = req.body.secondaddress;

    if (!firstaddress || !secondaddress) {
        return res.status(400).json({
            "message": "Campos Obrigatórios não preenchidos!"
        });
    }

    if(addressId){
        try {
            const addressData = await Address.findById(addressId, {
                clientId: true
            });
            if(addressData.clientId !== req.userId){
                return res.status(401).json({
                    "message": "Esta Morada não pertence a esta conta!",
                    "code": 0
                });
            }
            await Address.updateOne({
                _id: addressId
            }, {
                firstaddress,
                secondaddress
            });
        }catch(e){
            return res.status(404).json({
                "message": "Morada não encontrado!",
                "code": 1
            });
        }
    }else{
        await Address.create({
            firstaddress,
            secondaddress,
            clientId: req.userId,
            status: true
        });
    }

    res.status(200).json({
        "message": "Esta morada foi criado/atualizado com sucesso!",
        "code": 2
    });
}

export async function GetAddress(req, res) {
    const addressId = req.params.addressId;

    if(!addressId){
        return res.status(400).json({
            "message": "ID da morada não foi fornecido!"
        });
    }

    try {
        const address = await Address.findById(addressId, {
            clientId: true,
            firstaddress: true,
            secondaddress: true
        });
    

    if(address.clientId !== req.userId){
        return res.status(401).json({
            "message": "Esta morada não pertence a esta conta!",
            "code": 0
        });
    }

    res.status(200).json(address);
    }catch(e){
        return res.status(404).json({
            "message": "Morada não encontrado!",
            "code": 1
        });
    }
}

export async function DeleteAddress(req, res) {
    const addressId = req.params.addressId;

    if(!addressId){
        return res.status(400).json({
            "message": "ID da morada não foi fornecido!"
        });
    }

    try {
        const address = await Address.findById(addressId, {
            clientId: true
        });

        if(address.clientId !== req.userId){
            return res.status(401).json({
                "message": "Esta morada não pertence a esta conta!",
                "code": 0
            });
        }

        await Address.updateOne({
            _id: addressId
        }, {
            status: false
        });

        res.status(200).json({
            "message": "Morada removida com sucesso!",
            "code": 2
        });
}catch(e){
    return res.status(400).json({
        "message": "Morada não encontrado!",
        "code": 1
    });
}
}    