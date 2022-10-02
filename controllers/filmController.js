const {Film, Character, Genero} = require('../db.js')

//    MODIFICADO, ADD SWAGGER
const mostrarPelicula = async (req,res) => {
  try {
    const {name, genre, order} = req.query

    if(!name && !genre && !order){
      let movies = await Film.findAll({
        attributes: ["image", "title", "Creation date"],
      });
      return res.json(movies);
    }
    else{
          //name LISTO
      if (name) {
        try {
          const nombre = await Film.findAll({where: {title: name}})
          res.json(nombre);
        } catch (e) {
          res.send(e);
        }
        //FUNCIONA BUSQUEDA POR GENERO!
      } else if (genre) {
        try{
          const genero = await Genero.findOne({where: {id:genre},
            include: [
              { model: Film,
                attributes: ["title", "id", "calification", "image"],
                through: {
                  attributes: [],
                },
              },
            ],
          })
          res.json(genero);
        }catch(e){
          res.send(e)
        }
      } 
      else {
      try{
        //FUNCIONA TANTO DESC COMO ASC
        if(order==="DESC"){
          const orden = await Film.findAll({ 
            order: [['Creation date', 'DESC']]
          })
          res.send(orden)
        }
      else{
          const orden = await Film.findAll({ 
            order: [['Creation date', 'ASC']]
          })
          res.send(orden)
      }
      }catch(e){
        res.send(e)
      }
  }}

} catch (e) {
    res.send(e);
  }
}

//MODIFICADO, ADD SWAGGER
const detallePelicula = async (req,res) => {
  try {
    let { id } = req.params;
    const allData = await Film.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Character,
          attributes: ["name", "id","image", "age", "weight", "history"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!allData) {
      return res
        .status(404)
        .send("La película/serie con el ID provisto no existe");
    }
    res.json(allData);
  } catch (e) {
    res.send(e);
  }
}

const buscarPelicula = async (req,res) => {

    let { name, genre, order } = req.query;
    if (name || genre || order) {
      if (name) {
        try {
          res.json(
            await Film.findAll({
              where: {
                name,
              },
            })
          );
        } catch (e) {
          res.send(e);
        }
      } else if (genre) {
        try {
          res.json(
            await Film.findAll({
              where: {
                age,
              },
            })
          );
        } catch (e) {
          res.send(e);
        }
      } else {
        try {
          res.json(
            await Film.findOne({
              where: {
                id: order,
              },
            })
          );
        } catch (e) {
          res.send(e);
        }
      }
    } else {
      try {
        return res.json('No ha puesto ningún parámetro de consulta');
      } catch (e) {
        return res.send(e);
      }
    }
    





  //   const allData = await Film.findOne({
  //     where: {
  //       id,
  //     },
  //     include: [
  //       {
  //         model: Character,
  //         attributes: ["name", "id","image", "age", "weight", "history"],
  //         through: {
  //           attributes: [],
  //         },
  //       },
  //     ],
  //   });
  //   if (!allData) {
  //     return res
  //       .status(404)
  //       .send("La película/serie con el ID provisto no existe");
  //   }
  //   res.json(allData);

  //   res.send(e);

}

const crearPelicula = async (req,res) => {
  let { image, title, calification } = req.body;
  try {
    if (image && title && calification) {
      const newFilm = await Film.create({
        image,
        title,
        calification,
      });

      return res.status(201).json(newFilm);
    }
    return res
      .status(400)
      .send(
        "Falta ingresar el valor de una o más propiedades para crear la película/serie"
      );
  } catch (e) {
    res.send(e);
  }
}

const actualizarPelicula = async (req,res) => {
  const { id, image, title, calification } = req.body;
  try {
    if (id && image && title && calification) {
      const response = await Film.update(
        { image, title, calification },
        {
          where: {
            id,
          },
        }
      );
      return res.send(`${response} films modificados`);
    }
    return res
      .status(400)
      .send(
        "Falta ingresar el valor de una o más propiedades para modificar la película/serie"
      );
  } catch (e) {
    res.send(e);
  }
}

const eliminarPelicula = async (req,res) => {
  try {
    let { id } = req.params;
    const response = await Film.destroy({
      where: {
        id,
      },
    });
    if (response == 0) {
      return res
        .status(400)
        .send("El ID ingresado no corresponde a una película/serie válida");
    }
    return res.status(200).send(`${response} película/serie eliminada`);
  } catch (e) {
    res.send(e);
  }
}



module.exports = {
  mostrarPelicula,
  detallePelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula
}