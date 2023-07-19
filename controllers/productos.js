const { Producto } = require('../models');

/**
 * The function "obtenerProductos" retrieves a specified number of products from a database, skipping a
 * certain number of products, and returns the total count and the retrieved products.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request parameters, request body, etc. It is used to
 * retrieve information from the client and pass it to the server.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * `res.json()` which is used to send a JSON response.
 */
const obtenerProductos = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  /* 
    !SKIP es desde tal numero en adelante
*/
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre')
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    productos,
  });
};

/**
 * The function `crearProducto` creates a new product in a database, ensuring that the product name is
 * unique and saving it in uppercase.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as setting
 * the status code, sending JSON data, or redirecting the client to another URL.
 * @returns If the product already exists in the database, a response with status code 400 and a JSON
 * object containing the message "El producto [nombre del producto] ya existe" will be returned. If the
 * product does not exist, a response with status code 201 and the newly created product as a JSON
 * object will be returned.
 */
const crearProducto = async (req, res) => {
  const { estado, usuario, ...body } = req.body;

  try {
    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
      return res.status(400).json({
        msg: `El producto ${producto.nombre} ya existe`,
      });
    }

    const data = {
      ...body,
      nombre: body.nombre.toUpperCase(),
      usuario: req.usuario._id,
    };

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto);
  } catch (error) {}
};

/**
 * The function `obtenerProducto` retrieves a product by its ID and returns it as a JSON response,
 * including the associated user and category information.
 * @param req - The `req` parameter is the request object, which contains information about the
 * incoming HTTP request, such as the request headers, request body, and request parameters. In this
 * case, the `req.params` property is used to access the parameters passed in the URL. Specifically,
 * `req.params.id`
 * @param res - The "res" parameter is the response object that is used to send a response back to the
 * client. It is an object that has methods for sending different types of responses, such as sending
 * JSON data, redirecting the client to a different URL, or sending an error response. In this case,
 */
const obtenerProducto = async (req, res) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

  res.json(producto);
};

/**
 * The function `actualizarProducto` updates a product in a database with the provided data.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as setting
 * the status code and sending data.
 */
const actualizarProducto = async (req, res) => {
  const { id } = req.params;

  const { estado, usuario, ...data } = req.body;

  if (data.nombre) data.nombre = data.nombre.toUpperCase();

  data.usuario = req.usuario._id;

  try {
    const producto = await Producto.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json(producto);
  } catch (error) {}
};

/**
 * The function "borrarProducto" is an asynchronous function that updates the "estado" property of a
 * product to false and returns the updated product.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as the request method, request headers,
 * request body, and request parameters.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as setting
 * the status code and sending data.
 */
const borrarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const productoBorrado = await Producto.findByIdAndUpdate(
      id,
      {
        estado: false,
      },
      { new: true }
    );

    res.status(200).json(productoBorrado);
  } catch (error) {}
};

module.exports = {
  crearProducto,
  obtenerProducto,
  actualizarProducto,
  obtenerProductos,
  borrarProducto,
};
