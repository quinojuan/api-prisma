// class Animal {
//   name;
//   lastname;

//   constructor(name, x) {
//     this.name = name;
//   }
// }

// const garfield = new Animal("Garfield", "Torres")

// console.log(garfield.lastname)

class Animal {
  tipo = "perro"
  constructor () {
    this.tipo = "animal"
  }
  hablar () {
    return "Soy un animal"
  }
}

class Gato extends Animal {
  hablar() {
    return super.tipo + ", soy un gato"
  }
}

const garfield = new Gato();

console.log(garfield.tipo)