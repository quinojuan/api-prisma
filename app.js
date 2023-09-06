const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const morgan = require("morgan");
var XLSX = require("xlsx");

const prisma = new PrismaClient();
const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const file = "./productos2.xls"; // Ruta al archivo Excel
const publishers = "./publicadores.xlsx";

const workbook = XLSX.readFile(file);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const publicadores = XLSX.readFile(publishers);
const hojapublicadores = publicadores.Sheets[publicadores.SheetNames[0]];
const publicadoresData = XLSX.utils.sheet_to_json(hojapublicadores, {
  header: 1,
});

console.log(publicadoresData[1]);

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

async function cargarPublicadores() {
  for (const conjuntoDatosDos of publicadoresData) {
    const [
      nombre,
      apellido,
      genero,
      fecha_nacimiento,
      fecha_bautismo,
      esperanza,
      anciano,
      siervo_ministerial,
      precursor_regular,
      precursor_especial,
      grupo,
    ] = conjuntoDatosDos;

    await prisma.publicadores.create({
      data: {
        nombre,
        apellido,
        genero,
        fecha_nacimiento,
        fecha_bautismo,
        esperanza,
        anciano,
        siervo_ministerial,
        precursor_regular,
        precursor_especial,
        grupo,
      },
    });
  }
}

const verificarBasePublicadores = async () => {
  try {
    const query = await prisma.publicadores.findMany();
    if (query.length === 0) {
      cargarPublicadores();
      console.log("Datos cargados en la DB");
    } else {
      console.log("Datos ya cargados");
    }
  } catch (error) {
    console.log(error.message);
  }
};

verificarBasePublicadores();

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

app.post("/productos", async (req, res) => {
  try {
    const { codigo, descripcion, precio_venta } = req.body;
    const newProduct = await prisma.producto.create({
      data: {
        codigo,
        descripcion,
        precio_venta,
      },
    });
    res.json("Producto creado con éxito");
  } catch (error) {
    console.log({ error: error.message });
  }
});

//**************** SERVICE REPORT ****************//

app.post("/publicador", async (req, res) => {
  let {
    nombre,
    apellido,
    genero,
    fecha_nacimiento,
    fecha_bautismo,
    esperanza,
    anciano,
    siervo_ministerial,
    precursor_regular,
    precursor_especial,
    grupo,
  } = req.body;

  fecha_nacimiento = fecha_nacimiento + "T00:00:00Z";

  try {
    const newPub = await prisma.publicadores.create({
      data: {
        nombre,
        apellido,
        genero,
        fecha_nacimiento,
        fecha_bautismo,
        esperanza,
        anciano,
        siervo_ministerial,
        precursor_regular,
        precursor_especial,
        grupo,
      },
    });
    prisma.res.json(newPub);
  } catch (error) {
    res.json(error.message);
  }
});

app.post("/informe", async (req, res) => {
  let {
    mes,
    publicaciones,
    videos,
    horas,
    revisitas,
    estudios,
    notas,
    publicadorId,
  } = req.body;

  try {
    const newInforme = await prisma.informe.create({
      data: {
        mes,
        publicaciones,
        videos,
        horas,
        revisitas,
        estudios,
        notas,
        publicadorId,
      },
    });
    res.json(newInforme);
  } catch (error) {
    res.json(error.message);
  }
});

app.get("/publicadores", async (req, res) => {
  const allPublicadores = await prisma.publicadores.findMany({
    include: {
      informes: [],
    },
  });
  res.json(allPublicadores);
});

app.get("/ancianos", async (req, res) => {
  const allAncianos = await prisma.publicadores.findMany({
    where: {
      grupo: "G3",
    },
  });
  const result = allAncianos.map((e) => e.nombre);
  res.json(result);
  // res.json(allAncianos)
});

app.listen(3000, () => {
  console.log(`Server ready at: http://localhost:3000`);
});
