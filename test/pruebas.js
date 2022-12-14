let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
require('dotenv').config();

//Assertion style
chai.should();
chai.use(chaiHttp);

// Token para los tests.
const testToken = process.env.TEST_TOKEN;



describe("Personajes Disney API", () => {
  /**
   * Test the GET route
   */

  describe("GET /characters", () => {
    it("Deberia traer todos los personajes", (done) => {
      chai
        .request(server)
        .get("/characters")
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });

    it("NO Deberia traer todos los personajes", (done) => {
      chai
        .request(server)
        .get("/character")
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  /**
   * Test the GET (by id) route
   */

  describe("GET /character/:id", () => {
    it("Deberia traer un personaje por ID.", (done) => {
      const characterID = 19;

      chai
        .request(server)
        .get("/character/" + characterID)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("id");
          response.body.should.have.property("id").eq(19);
          response.body.should.have.property("image");
          response.body.should.have.property("name");
          response.body.should.have.property("age");
          response.body.should.have.property("weight");
          response.body.should.have.property("history");
          response.body.should.have.property("Films");
          done();
        });
    });

    it("NO deberia traer un personaje por ID.", (done) => {
      const characterID = 200;

      chai
        .request(server)
        .get("/character/" + characterID)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            "El personaje con el ID provisto no existe"
          );
          done();
        });
    });
  });

  /**
   * Test the POST route
   */

  describe("POST /character", () => {
    it("Deberia crear un nuevo personaje.", (done) => {
      const character = {
        image: "image-1",
        name: "Elsa",
        age: 22,
        weight: 55,
        history: "Una princesa fuera de lo común",
        film: {
            "image": "imag-4",
            "title": "DBZ Kay",
            "calification": 3,
            "genre": {
              "name": "Terror",
              "image": "imagen-Terror"
            }}
      };
      chai
        .request(server)
        .post("/character/")
        .send(character)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a("object");
          response.body.should.have.property("id");
          response.body.should.have.property("image").eq("image-1");
          response.body.should.have.property("name").eq("Elsa");
          response.body.should.have.property("age").eq(22);
          response.body.should.have.property("weight").eq(55);
          response.body.should.have
            .property("history")
            .eq("Una princesa fuera de lo común");
          done();
        });
    });

    it("NO deberia crear un nuevo personaje si falta una o más propiedades.", (done) => {

      const character = {
        image: "image-1",

        age: 22,
        weight: 55,
        history: "Una princesa fuera de lo común"
      };
      chai
        .request(server)
        .post("/character/")
        .send(character)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "Falta ingresar el valor de una o más propiedades para crear el personaje"
          );
          done();
        });
    });
  });

  /**
   * Test the PUT route
   */

  describe("PUT /character/:id", () => {
    it("Deberia modificar un personaje existente.", (done) => {
       const idCharacter = 22
      const character = {
        image: "image-1",
        name: "Elsa",
        age: 22,
        weight: 55,
        history: "Una princesa fuera de lo común",
      };
      chai
        .request(server)
        .put("/character/" + idCharacter)
        .send(character)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(200);
          response.text.should.be.eq("1 personajes modificados");
          done();
        });
    });

    it("NO deberia modificar un personaje existente si falta una o más propiedades.", (done) => {
        const idCharacter = 55 
      const character = {
        id: 1,
        image: "image-1",
        name: "Elsa",

        weight: 55,
        history: "Una princesa fuera de lo común",
      };
      chai
        .request(server)
        .put(`/character/${idCharacter}`)
        .send(character)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "Falta ingresar el valor de una o más propiedades para modificar el personaje"
          );
          done();
        });
    });
  });

  /**
   * Test the DELETE route
   */
  describe("DELETE /character/:id", () => {
    it("Deberia eliminar un personaje existente.", (done) => {
      const characterID = 35;
      chai
        .request(server)
        .delete("/character/" + characterID)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it("NO deberia eliminar un personaje existente si no se ha proporcionado un Id de personaje válido.", (done) => {
      const characterID = 100;
      chai
        .request(server)
        .delete("/character/" + characterID)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "El ID ingresado no corresponde a un personaje válido"
          );
          done();
        });
    });
  });

  /**
   * Testing a PELICULAS
   */

  /**
   * Test the GET route
   */
  describe("GET /movies", () => {
    it("Deberia traer todas las películas/series", (done) => {
      chai
        .request(server)
        .get("/movies")
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });

    it("NO deberia traer todas las películas/series por intentar acceder un URL inválido", (done) => {
      chai
        .request(server)
        .get("/movie")
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  /**
   * Test the GET (by id) route
   */

  describe("GET /movies/:id", () => {
    it("Deberia traer una película/serie por ID.", (done) => {
      const filmID = 3;

      chai
        .request(server)
        .get("/movies/" + filmID)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("id").eq(3);
          response.body.should.have.property("image");
          response.body.should.have.property("title");
          response.body.should.have.property("calification");
          done();
        });
    });

    it("NO deberia traer una película/serie por ID.", (done) => {
      const filmID = 1000;
      chai
        .request(server)
        .get("/movies/" + filmID)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            "La película/serie con el ID provisto no existe"
          );
          done();
        });
    });
  });

  /**
   * Test the POST route
   */

  describe("POST /film", () => {
    it("Deberia crear una nueva película/serie.", (done) => {
      const film = {
        image: "image-1",
        title: "Mission Impossible",
        calification: 4,
      };
      chai
        .request(server)
        .post("/film/")
        .send(film)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a("object");
          response.body.should.have.property("id");
          response.body.should.have.property("image").eq("image-1");
          response.body.should.have.property("title").eq("Mission Impossible");
          response.body.should.have.property("calification").eq(4);
          response.body.should.have.property("Creation date");
          done();
        });
    });

    it("NO deberia crear una nueva película/serie si falta una o más propiedades.", (done) => {
      const film = {
        image: "image-1",

        calification: 4,
      };
      chai
        .request(server)
        .post("/film/")
        .send(film)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "Falta ingresar el valor de una o más propiedades para crear la película/serie"
          );
          done();
        });
    });
  });

  /**
   * Test the PUT route
   */

  describe("PUT /movies/:id", () => {
    it("Deberia modificar una película/serie existente.", (done) => {
        const id = 40;
      const film = {      
        image: "image-1",
        title: "Bastardos sin Gloria",
        calification: 4,
      };
      chai
        .request(server)
        .put("/movies/"+ id)
        .send(film)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(200);
          response.text.should.be.eq("1 films modificados");
          done();
        });
    });

    it("NO deberia modificar una película/serie existente si falta una o más propiedades.", (done) => {
        const id = 23;
      const film = {
        id: 1,
        image: "image-1",

        calification: 1
      };
      chai
        .request(server)
        .put("/movies/"+ id)
        .send(film)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "Falta ingresar el valor de una o más propiedades para modificar la película/serie"
          );
          done();
        });
    });
  });

  /**
   * Test the DELETE route
   */
  describe("DELETE /movies/:id", () => {
    it("Deberia eliminar una película/serie existente.", (done) => {
      const movieID = 32;
      chai
        .request(server)
        .delete("/movies/" + movieID)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(200);
          response.text.should.be.eq("1 película/serie eliminada");

          done();
        });
    });

    it("NO deberia eliminar una película/serie existente si no se ha proporcionado un Id de película/serie válido.", (done) => {
      const filmID = 100;
      chai
        .request(server)
        .delete("/movies/" + filmID)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "El ID ingresado no corresponde a una película/serie válida"
          );
          done();
        });
    });
  });

  /**
   * Testing a USUARIOS
   */

  /**
   * Test the POST route
   */
  describe("POST /auth/register", () => {
    it("Deberia crear un nuevo usuario.", (done) => {
      const user = {
        username: "nodejs22",
        email: "dutyjjj2@hotmail.com",
        password: "1234",
      };
      chai
        .request(server)
        .post("/auth/register")
        .send(user)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a("object");
          response.body.should.have.property("auth").eq(true);
          response.body.should.have.property("token");
          done();
        });
    });

    it("NO deberia crear un nuevo usuario si falta una o más propiedades.", (done) => {
      const film = {
        username: "nahu-1",

        password: "1234",
      };
      chai
        .request(server)
        .post("/auth/register/")
        .send(film)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "Falta ingresar el valor de una o más propiedades para crear el usuario nuevo"
          );
          done();
        });
    });
  });

  describe("POST /auth/login", () => {
    it("Deberia iniciar sesión.", (done) => {
      const user = {
        email: "dutyjjj2@hotmail.com",
        password: "1234",
      };
      chai
        .request(server)
        .post("/auth/login")
        .send(user)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a("object");
          response.body.should.have.property("auth").eq(true);
          response.body.should.have.property("token");
          done();
        });
    });

    it("NO deberia iniciar sesión si falta una o más propiedades.", (done) => {
      const usuario = {
        email: "nahu-1",
      };
      chai
        .request(server)
        .post("/auth/login/")
        .send(usuario)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "Falta ingresar el valor de una o más propiedades para iniciar sesión"
          );
          done();
        });
    });

    it("NO deberia iniciar sesión si la contraseña es inválida.", (done) => {
      const usuario = {
        email: "duty@hotmail.com",
        password: "1234",
      };
      chai
        .request(server)
        .post("/auth/login/")
        .send(usuario)
        .set({ Authorization: testToken })
        .end((err, response) => {
          response.should.have.status(401);
          response.text.should.be.eq("Contraseña inválida");
          done();
        });
    });
  });
});
