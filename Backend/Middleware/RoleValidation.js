import Users from "../Models/Users";

export const CheckRole = (allowedRoles) => {
    return async (req, res, next) => {
        const userId = req.userId;
        const userInfo = await Users.findById(userId, {
            role: true
        });

        if(!allowedRoles.includes(userInfo.role)){
            return res.status(401).json({
                "message": "Impossivel aceder a este Endpoint!",
                "code": 0
            });
        }

        next();
    };
};