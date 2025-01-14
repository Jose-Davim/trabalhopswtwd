import { hasCustomGetInitialProps } from "next/dist/build/utils";
import HairDresser from "../Models/HairDresser";
import HairService from "../Models/HairService";
import users from "../Models/users";
import { CalcCrow, EmailValidation} from "../Utils/Functions";

export async function GetAllCartFromHairdresser(req, res){
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
            "message": "Campos em falta!"
        });
    }

    if(!EmailValidation(email)){
        return res.status(400).json({
            "message": "Email inválido!"
        });
    }

  if(validate.toString().lenght !== 9){
      return res.status(400).json({
          "message": "NIF inválido!"
      });
  }

  if(phonenumber.toString().lenght !== 9){
      return res.status(400).json({
          "message": "Número de telefone inválido!"
      });
  }

  if(isNaN(rating) || parseInt(rating) > 5 || parseInt(rating) < 0){
      return res.status(400).json({
          "message": "Rating inválido, o rating pode ser entre 0 a 5!",
          "code": 1
      });
  }

  const openstoreList = openstore.split(":");
  const closestoreList = closestore.split(":");

  const openstoreDate = new Date();
  openstoreDate.setHours(openstoreList[0]);
  openstoreDate.setMinutes(openstoreList[1]);
  openstoreDate.setSeconds(0);

  const closestoreDate = new Date();
  closestoreDate.setHours(closestoreList[0]);
  closestoreDate.setMinutes(closestoreList[1]);
  closestoreDate.setSeconds(0);

  if(openstoreDate > closestoreDate){
      return res.status(400).json({
          "message": "Horário de abertura não pode ser maior que o horário de fecho!"
      });
  }

  await HairDresser.create({
        name,
        photo,
        email,
        phonenumber,
        tax,
        observations: observations || "N/A",
        firstaddress,
        secondaddress,
        openstore: openstoreDate,
        closestore: closestoreDate,
        lat,
        long,
        daysoff,
        rating
  });

  res.status(200).json({
    "message": "Cabeleireiro criado com sucesso!"
  });
}


export async function GetHairDresser(req, res){
    const slug = req.params.slug;

    if(!slug){
        return res.status(400).json({
            "message": "O parametro não foi fornecido!"
        });
    }

    HairDresser.findById(slug, {
       firstaddress: true,
       secondaddress: true,
       openstore: true, 
       closestore: true,
       email: true,
       lat: true,
       long: true,
       photo: true,
       name: true,
       observations: true,
       rating: true,
       phonenumber: true,
       daysoff: true
    }).then((hairdresser) => {
        HairService.find({
            hairdresser: slug,
        }).then((services) => {
            res.status(200).json({
                hairdresser,
                services
            });
        })
    }).catch(() => {
        return res.status(404).json({
            "message": "Cabeleireiro não encontrado!"
        });
    });
}

export async function GetMyHairDresser(req, res){
    let hairdresserId;

    if(req.query.editedEntity){
        hairdresserId = req.query.editedEntity;
    }else{
        const userId = req.userId;

        const userHairDresser = await users.findById(userId, {
            entityConnected: true
        });

        if (!userHairDresser.entityConnected){
            return res.status(404).json({
                "message": "Cabeleireiro não encontrado!"
            });
        }
        hairdresserId = userHairDresser.entityConnected;
    }

    HairDresser.findById(hairdresserId, {
        firstaddress: true,
        secondaddress: true,
        openstore: true,
        closestore: true,
        email: true,
        lat: true,
        long: true,
        photo: true,
        name: true,
        observations: true,
        rating: true,
        phonenumber: true,
        daysoff: true
    }).then((hairdresser) => {
        res.status(200).json(hairdresser);
}).catch(() => {
    res.status(400).json({
        "message": "Cabeleireiro não encontrado!",
        "code": 1
    });
});
}

export async function UpdateHairDresser(req, res){
    let hairdresserId = req.params.hairdresserId;

    if(hairdresserId === "own"){
        const userHairDresser = await users.findById(req.userId);
            userHairDresser = userHairDresser.entityConnected;
    }
}
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
    
if(!hairdresserId || !name || !photo || !email || !phonenumber || !tax || !firstaddress || !secondaddress || !openstore || !closestore || !lat || !long){
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

 if(tax.toString().lenght !== 9){
     return res.status(400).json({
         "message": "NIF inválido!",
         "code": 1
     });
 }

    if(phonenumber.toString().lenght !== 9){
        return res.status(400).json({
            "message": "Número de telefone inválido!",
            "code": 1
        });
    }

    if(isNaN(rating) || parseInt(rating) > 5 || parseInt(rating) < 0){
        return res.status(400).json({
            "message": "Rating inválido, o rating pode ser entre 0 a 5!",
            "code": 1
        });
    }

    const openstoreList = openstore.split(":");
    const closestoreList = closestore.split(":");

    const openstoreDate = new Date();
    openstoreDate.setHours(openstoreList[0]);
    openstoreDate.setMinutes(openstoreList[1]);
    openstoreDate.setSeconds(0);

    const closestoreDate = new Date();
    closestoreDate.setHours(closestoreList[0]);
    closestoreDate.setMinutes(closestoreList[1]);
    closestoreDate.setSeconds(0);

    if(openstoreDate > closestoreDate){
        return res.status(400).json({
            "message": "Horário de abertura não pode ser maior que o horário de fecho!",
            "code": 1
        });
    }

    await HairDresser.updateOne({_id: hairdresserId}, {
        name,
        photo,
        email,
        phonenumber,
        tax,
        observations: observations || "N/A",
        firstaddress,
        secondaddress,
        openstore: openstoreDate,
        closestore: closestoreDate,
        lat,
        long,
        daysoff,
        rating
    });

    res.status(200).json({
        "message": "Cabeleireiro atualizado com sucesso!"
    });


    export async function GetAllHairDresserNames(req, res){
        const allHairDresser = await HairDresser.find({}, {
            name: true
        });

        res.status(200).json(allHairDresser);
    }

    export async function DeleteHairDresser(req, res){
      const hairdresserId = req.params.hairdresserId;

      if(!hairdresserId){
          return res.status(400).json({
              "message": "ID do cabeleireiro não foi fornecido!"
          });
      }
      try {
        await HairDresser.updateOne({
            _id: hairdresserId
        }, {
            isActived: false
        });

        res.status(200).json({
            "message": "Cabeleireiro removido com sucesso!",
            "code": 2
        });
      }catch(e){
          res.status(200).json({
              "message": "Erro ao remover o cabeleireiro!",
              "code": 0
          });
      }
    }
    export async function UpdateHairDresserPhoto(req, res){
        try {
            await HairDresser.updateOne({
                _id: req.params.hairdresserId
            }, {
                photo: req.fileName
            });
            res.status(200).json({
                "message": "Foto do cabeleireiro atualizada com sucesso!",
                "code": 1,
                "fileName": req.fileName
            });
        }catch(e){
            res.status(400).json({
                "message": "Erro ao atualizar a foto do cabeleireiro!",
                "code": 1
    });
}
    }
