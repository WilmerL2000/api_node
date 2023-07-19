const { isValidObjectId } = require('mongoose');
const { Usuario, Categoria, Producto } = require('../models');

const colecciones = ['usuarios', 'categorias', 'produtos', 'roles'];

/**
 * The function "buscar" is an asynchronous function that takes in a request and response object, and
 * based on the collection parameter, it calls different functions to search for users, categories, or
 * products.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information such as the request method, headers, URL, and parameters.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to another URL.
 * @returns In this code, if the `coleccion` is not included in the `colecciones` array, a response
 * with a status of 400 and a JSON message will be returned. If the `coleccion` is included in the
 * `colecciones` array, a switch statement is used to determine which function to call based on the
 * value of `coleccion`. The function that is called will perform
 */
const buscar = async (req, res) => {
  const { coleccion, termino } = req.params;

  if (!colecciones.includes(coleccion)) {
    return res
      .status(400)
      .json({ msg: `Las coleccioness permitidas son: ${colecciones}` });
  }

  switch (coleccion) {
    case 'usuarios':
      buscarUsuarios(termino, res);
      break;
    case 'categorias':
      buscarCategorias(termino, res);
      break;
    case 'produtos':
      buscarProductos(termino, res);
      break;

    default:
      res.status(500).json({ msg: 'Server error' });
      break;
  }
};

/**
 * The function `buscarUsuarios` searches for users in a MongoDB collection based on a provided search
 * term.
 * @param [termino] - The "termino" parameter is a string that represents the search term or keyword
 * used to search for users in the "Usuario" collection.
 * @param res - The "res" parameter is the response object that will be used to send the response back
 * to the client. It is typically an instance of the Express response object.
 * @returns The function `buscarUsuarios` returns a JSON response containing the search results. The
 * structure of the response is as follows:
 */
const buscarUsuarios = async (termino = '', res) => {
  const isMongoId = isValidObjectId(termino);

  if (isMongoId) {
    const usuario = await Usuario.findById(termino);

    return res.json({
      results: [usuario ?? []],
    });
  }

  const usuarios = await Usuario.find({
    $or: [
      {
        nombre: { $regex: termino, $options: 'i' },
      },
      {
        email: { $regex: termino, $options: 'i' },
      },
    ],
    $and: [{ estado: true }],
  });

  return res.json({
    results: usuarios,
  });
};

/**
 * The function `buscarCategorias` searches for categories based on a given search term, either by
 * category ID or by category name.
 * @param [termino] - The `termino` parameter is a string that represents the search term or keyword
 * used to search for categories. It is optional and has a default value of an empty string.
 * @param res - The "res" parameter is the response object that will be sent back to the client. It is
 * used to send the JSON response containing the search results.
 * @returns The function `buscarCategorias` returns a JSON response. If the `termino` parameter is a
 * valid MongoDB ObjectId, it will return a JSON object with a `results` property containing an array
 * with the found category or an empty array if no category is found. If the `termino` parameter is not
 * a valid MongoDB ObjectId, it will search for categories with a `nombre` field that
 */
const buscarCategorias = async (termino = '', res) => {
  const isMongoId = isValidObjectId(termino);

  if (isMongoId) {
    const categoria = await Categoria.findById(termino);

    return res.json({
      results: [categoria ?? []],
    });
  }

  const categorias = await Categoria.find({
    nombre: { $regex: termino, $options: 'i' },
    $and: [{ estado: true }],
  });

  return res.json({
    results: categorias,
  });
};

/**
 * The function `buscarProductos` searches for products based on a given search term, either by product
 * name or price, and returns the results.
 * @param [termino] - The `termino` parameter is a string that represents the search term or keyword
 * used to search for products. It is an optional parameter with a default value of an empty string.
 * @param res - The `res` parameter is the response object that will be used to send the response back
 * to the client. It is typically an instance of the Express `Response` object.
 * @returns The function `buscarProductos` returns a JSON response. If the `termino` parameter is a
 * valid MongoDB ObjectId, it will return a JSON object with a `results` property containing an array
 * with the found product or an empty array if no product is found. If the `termino` parameter is not a
 * valid ObjectId, it will search for products in the database based on the `nombre`
 */
const buscarProductos = async (termino = '', res) => {
  const isMongoId = isValidObjectId(termino);

  if (isMongoId) {
    const producto = await Producto.findById(termino).populate(
      'categoria',
      'nombre'
    );

    return res.json({
      results: [producto ?? []],
    });
  }

  const productos = await Producto.find({
    $or: [
      {
        nombre: { $regex: termino, $options: 'i' },
      },
      {
        precio: { $regex: termino, $options: 'i' },
      },
    ],
    $and: [{ estado: true }],
  }).populate('categoria', 'nombre');

  return res.json({
    results: productos,
  });
};

module.exports = { buscar };
