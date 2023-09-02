const express = require("express");
const { PrismaClient } = require("@prisma/client");
var XLSX = require("xlsx");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const file = "./productos2.xls"; // Ruta al archivo Excel

const workbook = XLSX.readFile(file);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log(excelData[1]);

async function insertarDatos() {
  for (const conjuntoDatos of excelData) {
    const [codigo, descripcion, precio_venta] = conjuntoDatos;

    await prisma.producto.create({
      data: {
        codigo,
        descripcion,
        precio_venta,
      },
    });
  }
}
const verificarBase = async () => {
  try {
    const query = await prisma.producto.findMany();
    if (query.length === 0) {
      insertarDatos();
      console.log("Datos cargados en la DB");
    } else {
      console.log("Datos ya cargados");
    }
  } catch (error) {
    console.log(error.message);
  }
};

verificarBase();

app.get("/", (req, res) => {
  res.json("Hola mundo!");
});

// Crear registro
app.post("/post", async (req, res) => {
  const { title, content } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
    },
  });
  res.json({ result });
});

// Mostrar todos los registros

app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json({ posts });
});

// Actualizar un registro
app.put("/post/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { title, content },
  });
  res.json(post);
});

// Eliminar un registro

app.delete("/post/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(`Post number ${id} deleted!`);
});

// Agregar productos

// app.post("/productos", async (req, res) => {

//   try {
//     for (const conjuntoDatos of excelData) {
//       const [id, descripcion, precio_venta] = conjuntoDatos;

//       await prisma.producto.create({
//         data: {
//           id,
//           descripcion,
//           precio_venta,
//         },
//       });
//     }
//     res.json("Operacion finalizada!");
//   } catch (error) {
//     console.log({error: error.message})
//   }

// });

app.listen(3000, () => {
  console.log(`Server ready at: http://localhost:3000`);
});
