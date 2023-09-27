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
  console.log(req.body);

  let {
    publicador,
    mes,
    publicaciones,
    videos,
    horas,
    revisitas,
    estudios,
    notas,
  } = req.body;

  const dividir = publicador.split(" ");

  const pubFound = await prisma.publicadores.findMany({
    where: {
      AND: [{ nombre: dividir[0] }, { apellido: dividir[1] }],
    },
  });

  console.log(pubFound);

  try {
    const newInforme = await prisma.informe.create({
      data: {
        publicadorId: parseInt(pubFound[0].id),
        mes,
        publicaciones: parseInt(publicaciones),
        videos: parseInt(videos),
        horas: parseInt(horas),
        revisitas: parseInt(revisitas),
        estudios: parseInt(estudios),
        notas,
      },
    });
    console.log(newInforme);
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

// esta ruta es de prueba

app.get("/consulta", async (req, res) => {
  const { id, nombre } = req.query;
  console.log({ nombre }, { id });
  const idModified = parseInt(id);

  try {
    const filteredData = await prisma.publicadores.findMany({
      where: {
        OR: [
          {
            id: idModified,
          },
          { nombre },
        ],
      },
    });
    if (!filteredData.length) {
      console.log("no encontramos nada");
      return res.json("no encontramos nada");
    }
    return res.json(filteredData);
  } catch (error) {
    res.json(error.message);
  }
  // const result = allAncianos.map((e) => e.nombre);
  // res.json(allAncianos)
});

app.put("/publicador/:id", async (req, res) => {
  const { id } = req.params;
  const parsedID = parseInt(id);
  const {
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

  try {
    const pubUdated = await prisma.publicadores.update({
      where: { id: parsedID },
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
    res.json(pubUdated);
  } catch (error) {
    res.json(error.message);
  }
});

app.listen(3000, () => {
  console.log(`Server ready at: http://localhost:3000`);
});
