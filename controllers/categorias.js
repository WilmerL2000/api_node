const { Categoria } = require('../models');

const crearCategoria = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();

  try {
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
      return res.status(400).json({
        msg: `La categoria ${categoria.nombre} ya existe`,
      });
    }

    const data = {
      nombre,
      usuario: req.usuario._id,
    };

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);
  } catch (error) {}
};

const obtenerCategorias = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    categorias,
  });
};

const obtenerCategoria = async (req, res) => {};

const actualizarCategoria = async (req, res) => {};

const borrarCategoria = async (req, res) => {};

module.exports = {
  crearCategoria,
  obtenerCategoria,
  actualizarCategoria,
  obtenerCategorias,
};
