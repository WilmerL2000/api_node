const fs = require('fs');
const path = require('path');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

/**
 * The function `cargarArchivo` is an asynchronous function that handles file uploads and returns the
 * name of the uploaded file.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the headers, query parameters, and body.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an instance of the Express `Response` object.
 * @returns The function `cargarArchivo` returns a JSON object with the property `nombre`.
 */
const cargarArchivo = async (req, res) => {
  try {
    // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
    const nombre = await subirArchivo(req.files, undefined, 'imgs');
    res.json({ nombre });
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * The function `actualizarImagen` updates the image of a user or product model in a database and
 * deletes the previous image if it exists.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes data such as the request headers, request parameters,
 * request body, etc. In this code snippet, `req` is used to access the `params` property, which
 * contains the route
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It is an instance of the Express `Response` object.
 * @returns a JSON response with the `id` and `coleccion` values.
 */
const actualizarImagen = async (req, res) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: 'Hubo un error' });
  }

  // Limpiar imagenes
  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img
    );
    /* The code `if (fs.existsSync(pathImagen)) { fs.unlinkSync(pathImagen); }` is checking if the
    image file exists at the specified path (`pathImagen`). If the file exists, it is deleted using
    the `fs.unlinkSync()` method. This code is used to remove the previous image file before
    updating it with a new one. */
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }
  modelo.img = await subirArchivo(req.files, undefined, coleccion);
  await modelo.save();
};

const actualizarImagenCloudinary = async (req, res) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: 'Hubo un error' });
  }

  if (modelo.img) {
    /* The code `const nombreArr = modelo.img.split('/')[-1];` is splitting the `modelo.img` string by the
 forward slash ('/') and accessing the last element of the resulting array. This is done to extract
 the filename and extension from the URL. */
    const nombreArr = modelo.img.split('/')[-1];
    const id = nombreArr.split('.')[1];
    await cloudinary.uploader.destroy(id);
  }
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;
  await modelo.save();

  res.json(modelo);
};

const mostrarImagen = async (req, res) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: 'Hubo un error' });
  }

  // Limpiar imagenes
  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img
    );
    /* The code `if (fs.existsSync(pathImagen)) { fs.unlinkSync(pathImagen); }` is checking if the
    image file exists at the specified path (`pathImagen`). If the file exists, it is deleted using
    the `fs.unlinkSync()` method. This code is used to remove the previous image file before
    updating it with a new one. */
    if (fs.existsSync(pathImagen)) {
      res.sendFile(pathImagen);
    }
  }

  const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathImagen);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
