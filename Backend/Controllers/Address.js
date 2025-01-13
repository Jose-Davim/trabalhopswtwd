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

    if (addressId){
        try {
            const addressData = await Address.findById(addressId, {
                clientId: true
            });

    
    if (addressData.clientId !== req.userId) {
        return res.status(401).json({
            "message": "Este local não pertence a esta conta!",
            "code": 0
        });
    }
    await Address.updateOne({
        _id: addressId
    }, {
        firstaddress,
        secondaddress
    });
}
    }
}