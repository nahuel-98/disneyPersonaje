let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')

//Assertion style
chai.should()

chai.use(chaiHttp)

describe('Personajes Disney API', ()=>{
    /**
     * Test the GET route
     */

    describe('GET /characters', ()=>{
        it('Deberia traer todos los personajes', (done) =>{
            chai.request(server)
                .get('/characters')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array')
                done()
                })
        })

        it('NO Deberia traer todos los personajes', (done) =>{
            chai.request(server)
                .get('/character')
                .end((err, response) => {
                    response.should.have.status(404);
                done()
                })
        })
    } )


    /**
     * Test the GET (by id) route
     */


    describe('GET /character/:id', ()=>{
        it('Deberia traer un personaje por ID.', (done) =>{
            const characterID= 3;

            chai.request(server)
                .get('/character/' + characterID)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object')
                    response.body.should.have.property('id')
                    response.body.should.have.property('id').eq(3)
                    response.body.should.have.property('image')
                    response.body.should.have.property('name')
                    response.body.should.have.property('age')
                    response.body.should.have.property('weight')
                    response.body.should.have.property('history')
                done();
                });
        });

        it('NO deberia traer un personaje por ID.', (done) =>{
            const characterID= 200;

            chai.request(server)
                .get('/character/' + characterID)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.be.eq('El personaje con el ID provisto no existe')
                done();
                });
        });
    });



     /**
     * Test the POST route
     */

    describe('POST /character', ()=>{
        it('Deberia crear un nuevo personaje.', (done) =>{
                const character = {
                    "image": "image-1",
                    "name":"Elsa",
                    "age":22,
                    "weight": 55,
                    "history": "Una princesa fuera de lo común"
                }
                chai.request(server)
                    .post('/character/')
                    .send(character)
                    .end((err, response) => {
                        response.should.have.status(201);
                        response.body.should.be.a('object')
                        response.body.should.have.property('id')
                        response.body.should.have.property('image').eq('image-1')
                        response.body.should.have.property('name').eq('Elsa')
                        response.body.should.have.property('age').eq(22)
                        response.body.should.have.property('weight').eq(55)
                        response.body.should.have.property('history').eq('Una princesa fuera de lo común')
                    done();
                    });
        });

        it('NO deberia crear un nuevo personaje si falta una o más propiedades.', (done) =>{
            const character = {
                "image": "image-1",
        
                "age":22,
                "weight": 55,
                "history": "Una princesa fuera de lo común"
            }
            chai.request(server)
                .post('/character/')
                .send(character)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq('Falta ingresar el valor de una o más propiedades para crear el personaje')
                done();
                });
        });

    });


     /**
     * Test the PUT route
     */

    describe('PUT /character', ()=>{
        it('Deberia modificar un personaje existente.', (done) =>{
                const character = {
                    "id":22,
                    "image": "image-1",
                    "name":"Elsa",
                    "age":22,
                    "weight": 55,
                    "history": "Una princesa fuera de lo común"
                }
                chai.request(server)
                    .put('/character/')
                    .send(character)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.text.should.be.eq('1 personajes modificados')
                    done();
                    });
        });

        it('NO deberia modificar un personaje existente si falta una o más propiedades.', (done) =>{
            const character = {
                "id":1,
                "image": "image-1",
                "name": "Elsa",

                "weight": 55,
                "history": "Una princesa fuera de lo común"
            }
            chai.request(server)
                .put('/character/')
                .send(character)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq('Falta ingresar el valor de una o más propiedades para modificar el personaje')
                done();
                });
        });
    })

     /**
     * Test the DELETE route
     */
    describe('DELETE /character/:id', ()=>{
        it('Deberia eliminar un personaje existente.', (done) =>{
                const characterID = 20
                chai.request(server)
                    .delete('/character/' + characterID)
                    .end((err, response) => {
                        response.should.have.status(200);
                    done();
                    });
        });

        it('NO deberia eliminar un personaje existente si no se ha proporcionado un Id de personaje válido.', (done) =>{
            const characterID = 100
            chai.request(server)
                .delete('/character/' + characterID)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq('El ID ingresado no corresponde a un personaje válido')
                done();
                });
        });
    })

    /**
     * Testing a PELICULAS
     */

    /**
     * Test the GET route
     */    
    describe('GET /movies', ()=>{
        it('Deberia traer todas las películas/series', (done) =>{
            chai.request(server)
                .get('/movies')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array')
                done()
                })
        })

        it('NO deberia traer todas las películas/series por intentar acceder un URL inválido', (done) =>{
            chai.request(server)
                .get('/movie')
                .end((err, response) => {
                    response.should.have.status(404);
                done()
                })
        })
    })
    
/**
     * Test the GET (by id) route
     */


 describe('GET /films/:id', ()=>{
    it('Deberia traer una película/serie por ID.', (done) =>{
        const filmID= 3;

        chai.request(server)
            .get('/films/' + filmID)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object')
                response.body.should.have.property('id').eq(3)
                response.body.should.have.property('image')
                response.body.should.have.property('title')
                response.body.should.have.property('calification')
            done();
            });
    });

    it('NO deberia traer una película/serie por ID.', (done) =>{
        const filmID= 100;
        chai.request(server)
            .get('/films/' + filmID)
            .end((err, response) => {
                response.should.have.status(404);
                response.text.should.be.eq('La película/serie con el ID provisto no existe')
            done();
            });
        });
    });


     /**
     * Test the POST route
     */

      describe('POST /film', ()=>{
        it('Deberia crear una nueva película/serie.', (done) =>{
                const film = {
                    "image": "image-1",
                    "title":"Mission Impossible",
                    "calification":4
                }
                chai.request(server)
                    .post('/film/')
                    .send(film)
                    .end((err, response) => {
                        response.should.have.status(201);
                        response.body.should.be.a('object')
                        response.body.should.have.property('id')
                        response.body.should.have.property('image').eq('image-1')
                        response.body.should.have.property('title').eq('Mission Impossible')
                        response.body.should.have.property('calification').eq(4)
                        response.body.should.have.property('Creation date')
                    done();
                    });
        });

        it('NO deberia crear una nueva película/serie si falta una o más propiedades.', (done) =>{
            const film = {
                "image": "image-1",
        
                "calification":4
            }
            chai.request(server)
                .post('/film/')
                .send(film)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq('Falta ingresar el valor de una o más propiedades para crear la película/serie')
                done();
                });
        });

    });

     /**
     * Test the PUT route
     */

      describe('PUT /films', ()=>{
        it('Deberia modificar una película/serie existente.', (done) =>{
                const film = {
                    "id":5,
                    "image": "image-1",
                    "title":"Bastardos sin Gloria",
                    "calification":4
                }
                chai.request(server)
                    .put('/films/')
                    .send(film)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.text.should.be.eq('1 films modificados')
                    done();
                    });
        });

        it('NO deberia modificar una película/serie existente si falta una o más propiedades.', (done) =>{
            const film = {
                "id":1,
                "image": "image-1",

                "calification":1
            }
            chai.request(server)
                .put('/films/')
                .send(film)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq('Falta ingresar el valor de una o más propiedades para modificar la película/serie')
                done();
                });
        });
    })

     /**
     * Test the DELETE route
     */
      describe('DELETE /movies/:id', ()=>{
        it('Deberia eliminar una película/serie existente.', (done) =>{
                const movieID = 16
                chai.request(server)
                    .delete('/movies/' + movieID)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.text.should.be.eq('1 película/serie eliminada')
                        
                    done();
                    });
        });

        it('NO deberia eliminar una película/serie existente si no se ha proporcionado un Id de película/serie válido.', (done) =>{
            const filmID = 100
            chai.request(server)
                .delete('/movies/' + filmID)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq('El ID ingresado no corresponde a una película/serie válida')
                done();
                });
        });
    })


    /**
     * Testing a USUARIOS
     */

    /**
     * Test the POST route
     */    
     describe('POST /auth/register', ()=>{
        it('Deberia crear un nuevo usuario.', (done) =>{
                const user = {
                    "username": "callduty22",
                    "email":"duty19@hotmail.com",
                    "password": "g221234"
                }
                chai.request(server)
                    .post('/auth/register')
                    .send(user)
                    .end((err, response) => {
                        response.should.have.status(201);
                        response.body.should.be.a('object')
                        response.body.should.have.property('auth').eq(true)
                        response.body.should.have.property('token')
                    done();
                    });
        });

        it('NO deberia crear un nuevo usuario si falta una o más propiedades.', (done) =>{
            const film = {
                "username": "nahu-1",
        
                "password": "1234"
            }
            chai.request(server)
                .post('/auth/register/')
                .send(film)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq('Falta ingresar el valor de una o más propiedades para crear el usuario nuevo')
                done();
                });
        });
    })


    describe('POST /auth/login', ()=>{
        it('Deberia iniciar sesión.', (done) =>{
                const user = {
                    "email":"duty@hotmail.com",
                    "password": "g221234"
                }
                chai.request(server)
                    .post('/auth/login')
                    .send(user)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object')
                        response.body.should.have.property('auth').eq(true)
                        response.body.should.have.property('token')
                    done();
                    });
        });

        it('NO deberia iniciar sesión si falta una o más propiedades.', (done) =>{
            const usuario = {
                "email": "nahu-1"
            }
            chai.request(server)
                .post('/auth/login/')
                .send(usuario)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq('Falta ingresar el valor de una o más propiedades para iniciar sesión')
                done();
                });
        });

        it('NO deberia iniciar sesión si la contraseña es inválida.', (done) =>{
            const usuario = {
                "email": "duty@hotmail.com",
                "password": "1234"
            }
            chai.request(server)
                .post('/auth/login/')
                .send(usuario)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.text.should.be.eq('Contraseña inválida')
                done();
                });
        });
    })
})
