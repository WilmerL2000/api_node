const { Categoria } = require('../models');

/**
 * The function `crearCategoria` creates a new category in a database if it doesn't already exist.
 * @param req - The `req` parameter is the request object, which contains information about the
 * incoming HTTP request, such as the request headers, request body, and request parameters.
 * @param res - The "res" parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to another URL.
 * @returns If the category already exists, a response with status code 400 and a message indicating
 * that the category already exists is returned. If the category does not exist, a response with status
 * code 201 and the created category object is returned.
 */
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

/**
 * The function `obtenerCategorias` retrieves a specified number of categories from a database and
 * returns the total count and the categories.
 * @param req - The `req` parameter is an object that represents the HTTP request made to the server.
 * It contains information about the request such as the request method, request headers, request body,
 * query parameters, and route parameters. In this code snippet, the `req` parameter is used to access
 * the query parameters
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * `res.json()` which is used to send a JSON response.
 */
const obtenerCategorias = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  /* The code `const [total, categorias] = await Promise.all([...])` is using `Promise.all()` to execute
multiple asynchronous operations concurrently and wait for all of them to complete. 
!SKIP es desde tal numero en adelante
*/
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate('usuario', 'nombre')
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    categorias,
  });
};

const obtenerCategoria = async (req, res) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

  res.json(categoria);
};

/**
 * The function `actualizarCategoria` updates a category in a database with the provided data.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as the request headers, request body,
 * request parameters, etc. In this code snippet, `req` is used to access the request parameters
 * (`req.params`), request body
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as setting
 * the status code and sending JSON data.
 */
const actualizarCategoria = async (req, res) => {
  const { id } = req.params;

  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  try {
    const categoria = await Categoria.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json(categoria);
  } catch (error) {}
};

/**
 * The function `borrarCategoria` is an asynchronous function that updates the `estado` property of a
 * category with the specified `id` to `false` and returns the updated category.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as the request method, request headers,
 * request body, request parameters, etc. In this case, `req.params` is an object that contains the
 * route parameters extracted from the
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as setting
 * the status code and sending data.
 */
const borrarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const categoriaBorrada = await Categoria.findByIdAndUpdate(
      id,
      {
        estado: false,
      },
      { new: true }
    );

    res.status(200).json(categoriaBorrada);
  } catch (error) {}
};

module.exports = {
  crearCategoria,
  obtenerCategoria,
  actualizarCategoria,
  obtenerCategorias,
  borrarCategoria,
};
