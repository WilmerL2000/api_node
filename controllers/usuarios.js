const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

/**
 * This JavaScript function retrieves a specified number of active users from a database and returns
 * the total count and the user data.
 * @param [req] - The `req` parameter is the request object that contains information about the
 * incoming HTTP request, such as headers, query parameters, and body data.
 * @param [res] - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an instance of the `response` object from the Express framework.
 */
const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

/**
 * The function `usuariosPost` receives a request with user data, encrypts the password, and saves the
 * user in the database.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters. It is an object
 * that is provided by the Express framework.
 * @param [res] - The `res` parameter is the response object that is used to send a response back to
 * the client. It is an instance of the `response` object from the Express framework.
 */
const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  await usuario.save();

  res.json({
    usuario,
  });
};

/**
 * The function `usuariosPut` updates a user's information, including encrypting the password if
 * provided, and returns the updated user.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as the request headers, request body,
 * request method, request URL, and more.
 * @param [res] - The `res` parameter is the response object that is used to send a response back to
 * the client. It is an instance of the `response` object from the Express framework.
 */
const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: 'patch API - usuariosPatch',
  });
};

/**
 * The `usuariosDelete` function updates the `estado` property of a user to `false` in the database.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters. In this case, it is
 * used to extract the `id` parameter from the request URL.
 * @param [res] - The `res` parameter is the response object that is used to send a response back to
 * the client. It is an instance of the `response` object from the Express framework.
 */
const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json(usuario);
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
