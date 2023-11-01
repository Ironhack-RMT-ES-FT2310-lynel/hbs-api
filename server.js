const express = require('express')
const app = express()

// configuraciones del servidor
app.set('view engine', 'hbs');

// todas las vistas estan ubicadas en __dirname + "/views/"
app.set("views", __dirname + "/views/")

// configuramos que mi servidor utilizará parciales de HBS (mini plantillas para evitar repetir codigo)
const hbs = require("hbs")
hbs.registerPartials(__dirname + "/views/partials")


// requerimos la data usada en la pagina
const lessonsData = require("./data/lessons-data.js")

const DogApi = require('doggo-api-wrapper');
const myDog = new DogApi();

app.get('/', (req, res) => {
  // res.send('Hello World!')

  // JS utiliza las plantillas, para crear un HTML y luego enviarlo al cliente
  res.render("home.hbs") 

})

app.get("/about", (req, res) => {

  let data = {
    schoolName: "Ironhack",
    leadTeacher: "Jorge",
    staff: ["Antonio", "Ruth", "Leidy"]
  }

  res.render("about.hbs", data)
  // ! la data que pasamos al render SIEMPRE deberia ser un objeto
})


app.get("/lessons", (req, res) => {

  res.render("all-lessons.hbs", {
    allLessons: lessonsData
  })

})


app.get("/lessons/by-approval/:aprovedType", (req, res) => {

  // req.params.approvedType = ??? // "aprobadas" o "no-aprobadas"
  console.log(req.params.aprovedType)

  // queremos enviar unicamente las lecciones aprobadas

  let filteredLessons = lessonsData.filter((eachLesson) => {
    // le retornemos true (incluyela) o false (no la incluyas)
    if (req.params.aprovedType === "aprobadas") {
      return eachLesson.approved === true
    } else if (req.params.aprovedType === "no-aprobadas") {
      return eachLesson.approved === false
    }
  })
  // console.log(filteredLessons)

  // ejemplo de poner bootcamp en mayuscula antes de enviar a HBS
  // filteredLessons.forEach((eachLesson) => eachLesson.bootcamp = eachLesson.bootcamp.toUpperCase())

  res.render("lessons-by-approval.hbs", {
    // filteredLessons: filteredLessons
    filteredLessons
  })

})

// Flujo para crear un ruta

// 1. Deberiamos crear la ruta
// 2. Deberias crear la vista con un placeholder
// 3. renderizar la vista y probar que funciona
// 4. terminar la funcionalidad de la data a enviar
// 5. renderizar la data en la vista


app.get("/dog/random", (req, res) => {

  myDog.getARandomDog()
  .then((response) => {
    console.log(response)

    res.render("dogs/random.hbs", {
      dogImage: response.message
    })

  })
  .catch((err) => {
    console.log(err)
  })

})

app.get("/dog/breed-list", (req, res) => {

  myDog.getListOfAllBreeds()
  .then((response) => {
    let listOfBreeds = Object.keys(response.message)
    console.log(listOfBreeds)
    res.render("dogs/list.hbs", {
      listOfBreeds
    })
  })
  .catch((error) => {
    console.log(error)
  })


})

app.get("/dog/by-breed/:breed", (req, res) => {

  myDog.getAllDogsByBreed(req.params.breed)
  .then((response) => {
    console.log(response)
    res.render("dogs/breed-dogs.hbs", {
      dogList: response.message,
      breed: req.params.breed
    })
  })
  .catch((error) => {
    console.log(error)
  })


})


const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})