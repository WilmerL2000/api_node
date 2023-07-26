const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivo } = require('../middlewares');
const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

router.post('/', validarArchivo, cargarArchivo);

router.put(
  '/:coleccion/:id',
  [
    validarArchivo,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionesPermitidas(c, ['usuarios', 'productos'])
    ),
    validarCampos,
  ],
  actualizarImagenCloudinary
  // actualizarImagen
);

router.get(
  '/:coleccion/:id',
  [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionesPermitidas(c, ['usuarios', 'productos'])
    ),
    validarCampos,
  ],
  mostrarImagen
);

const router = Router();

module.exports = router;
