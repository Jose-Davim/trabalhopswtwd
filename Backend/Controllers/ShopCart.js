import Users from "../Models/users";
import ShopCart from "../Models/ShopCart";
import Address from "../Models/Address";
import ShopCartItems from "../Models/ShopCartItems";
import HairDresser from "../Models/HairDresser";
import HairService from "../Models/HairService";

export async function SaveReservation(req, res) {
   const paymentMethod = req.body.paymentMethod;
   const userId = req.body.userId;
   const address = req.body.address;
   const hairdresserId = req.body.hairdresserId;
   const hairService = req.body.hairService;
   const observation = req.body.observation;

    if (!paymentMethod || !userId || !address || !hairdresserId || !hairService) {
        return res.status(400).json({
            "message": "Campos Obrigatórios",
            "code": 0
        });
    }

    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ "message": "Utilizador não encontrado", "code": 1 });
        }

        const address = await Address.findById(address);
        if (!address) {
            return res.status(404).json({ "message": "Morada não encontrado", "code": 1 });
        }

        const hairdresser = await HairDresser.findById(hairdresserId);
        if (!hairdresser) {
            return res.status(404).json({ "message": "Hairdresser not found", "code": 1 });
        }

        const hairService = await HairService.findById(hairService);
        if (!hairService) {
            return res.status(404).json({ "message": "Hair service not found", "code": 1 });
        }

        async function calculatePriceToPay() {
            try {
                const service = await HairService.findById(hairService, { price: true });
                return service.price;
            } catch (error) {
                return res.status(500).json({ "message": "Internal Server Error", "code": 1 });
            }
        }

        const shopCart = await ShopCart.create({
            date: new Date(),
            price: await calculatePriceToPay(),
            client: userId,
            observation: observation || 'N/A',
            hairdresserId,
            reservation: "N/A",
            paymentMethod: paymentMethod,
            status: "PENDING"
        });

        await ShopCartItems.create({
            shopCartId: shopCart._id,
            userId ,
            address,
            hairdresserId,
            hairService,
            paymentMethod,
            observation
        });

        res.status(200).json({
            "message": "Reservation saved successfully!",
            "code": 2,
            shopCart
        });
    } catch (error) {
        res.status(500).json({ "message": "Server error", "code": 1, error });
    }
}

export async function GetAllCartFromUser(req, res) {
    try {
        const cartData = await ShopCart.find({
            clientId: req.userId
        });

        const cartListData = await Promise.all(cartData.map(async (cartInfo) => {
            const hairdresserData = await HairDresser.findById(cartInfo.hairdresserId, {
                name: true
            });

            const cartItemsList = await ShopCartItems.find({
                shopCartId: cartInfo._id
            }, {
                hairServiceId: true,
                observation: true
            });

            const allItems = await Promise.all(cartItemsList.map(async (itemsList) => {
                const serviceInfo = await HairService.findById(itemsList.hairServiceId, {
                    name: true
                });

                const updatedItemsList = {
                    ...itemsList.toObject(),
                    serviceInfo
                };

                return updatedItemsList;
            }));

            const addressData = await Address.findById(cartInfo.addressId, {
                addressLines: true
            });
            
            const usersData = await Users.findById(cartInfo.clientId, {
                name: true
            });

            const updatedCartInfo = {
                ...cartInfo.toObject(),
                name: hairdresserData.name,
                id: hairdresserData._id,
                addressData,
                usersData,
                allItems
            };

            return updatedCartInfo;
        }));

        res.status(200).json(cartListData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function UpdateCartStatus(req, res){
    const cartId = req.params.cartId;
    const status = req.body.status;

    if(!cartId || !status) {
        return res.status(400).json({
            "message": "Missing fields! See API documentation",
            "code": 0
        });
    }

    await ShopCart.updateOne({_id: cartId}, {
        status
    });

    res.status(200).json({
        "message": "Cart status updated",
        "code": 2
    });
}

export async function GetCartMetadata(req, res){
    const cartId = req.params.cartId;

    if(!cartId){
        return res.status(400).json({
            "message": "Missing fields! See API documentation",
            "code": 0
        });
    }

    ShopCart.findById(cartId, {
        addressId: true,
        paymentMethod: true,
        observation: true
    }).then(async (cartData) => {
        res.status(200).json(cartData);
    }).catch((err) => {
        res.status(404).json({
            "message": "Cart not found",
            "code": 0
        });
    })
}

export async function UpdateCart(req, res){
    const cartId = req.params.cartId;
    const paymethod = req.body.paymethod;
    const observations = req.body.observations;
    const address = req.body.address;
    const hairServices = req.body.hairServices;

    if(!hairServices || !address || !paymethod || !cartId){
        return res.status(400).json({
            "message": "Missing fields! See API documentation",
            "code": 0
        });
    }

    await ShopCartItems.deleteMany({
        shopCartId: cartId
    });

    hairServices.forEach(async (service) => {
        await ShopCartItems.create({
            shopCartId: cartId,
            observations: 'N/A',
            hairServiceId: service.id
        });
    });

    async function calculatePriceToPay() {
        try {
            const prices = await Promise.all(
                hairServices.map(async (service) => {
                    try {
                        const searchService = await HairService.findById(service.id, {
                            price: true
                        });
                        return searchService.price;
                    } catch (e) {
                        return res.status(404).json({ "message": "A Hair Service Id is invalid!", "code": 1 });
                    }
                })
            );

            const totalPrice = prices.reduce((acc, price) => acc + parseFloat(price), 0);
            return totalPrice;
        } catch (error) {
            return res.status(500).json({ "message": "Internal Server Error", "code": 1 });
        }
    }

    await ShopCart.updateOne({
        _id: cartId
    }, {
        paymentMethod: paymethod,
        addressId: address,
        observation: observations || 'N/A',
        price: await calculatePriceToPay()
    });

    res.status(200).json({
        "message": "Cart updated!",
        "code": 2
    });
}

export async function GetAllCartFromHairdresser(req, res) {
    try {
        const connectedUser = await Users.findById(req.userId, {
            entityConnected: true
        });

        const cartData = await ShopCart.find({
            hairdresserId: connectedUser.entityConnected
        });

        const cartListData = await Promise.all(cartData.map(async (cartInfo) => {
            const hairdresserData = await HairDresser.findById(cartInfo.hairdresserId, {
                name: true
            });

            const cartItemsList = await ShopCartItems.find({
                shopCartId: cartInfo._id
            }, {
                hairServiceId: true,
                observations: true
            });

            const allItems = await Promise.all(cartItemsList.map(async (itemsList) => {
                const serviceInfo = await HairService.findById(itemsList.hairServiceId, {
                    name: true
                });

                const updatedItemsList = {
                    ...itemsList.toObject(),
                    serviceInfo
                };

                return updatedItemsList;
            }));

            const addressData = await Address.findById(cartInfo.addressId, {
                addressLines: true
            });
            
            const usersData = await Users.findById(cartInfo.clientId, {
                name: true
            });

            const updatedCartInfo = {
                ...cartInfo.toObject(),
                name: hairdresserData.name,
                id: hairdresserData._id,
                addressData,
                usersData,
                allItems
            };

            return updatedCartInfo;
        }));

        res.status(200).json(cartListData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function GetAllCarts(req, res) {
    try {
        const cartData = await ShopCart.find();

        const cartListData = await Promise.all(cartData.map(async (cartInfo) => {
            const hairdresserData = await HairDresser.findById(cartInfo.hairdresserId, {
                name: true
            });

            const cartItemsList = await ShopCartItems.find({
                shopCartId: cartInfo._id
            }, {
                hairServiceId: true,
                observations: true
            });

            const allItems = await Promise.all(cartItemsList.map(async (itemsList) => {
                const serviceInfo = await HairService.findById(itemsList.hairServiceId, {
                    name: true
                });

                const updatedItemsList = {
                    ...itemsList.toObject(),
                    serviceInfo
                };

                return updatedItemsList;
            }));

            const addressData = await Address.findById(cartInfo.addressId, {
                addressLines: true
            });
            
            const usersData = await Users.findById(cartInfo.clientId, {
                name: true
            });

            const updatedCartInfo = {
                ...cartInfo.toObject(),
                name: hairdresserData.name,
                id: hairdresserData._id,
                addressData,
                usersData,
                allItems
            };

            return updatedCartInfo;
        }));

        res.status(200).json(cartListData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
