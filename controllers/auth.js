const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

/**
 * The login function in JavaScript checks if a user's email exists, if the user is active, and if the
 * password is correct, and then generates a JWT token.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters.
 * @param [res] - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an instance of the `response` object from the Express framework.
 * @returns a JSON response with the user object and a token.
 */
const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correo',
      });
    }

    // SI el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado: false',
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password',
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
};

/**
 * The function `googleSignin` is an asynchronous function that handles the process of signing in a
 * user using Google authentication.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made to the server. It includes properties such as the request headers, request body,
 * request method, request URL, etc.
 * @param [res] - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an instance of the `response` object from the Express framework.
 * @returns a JSON response with the user object and a token.
 */
const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      // Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    // Si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado',
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Token de Google no es válido',
    });
  }
};

module.exports = {
  login,
  googleSignin,
};
