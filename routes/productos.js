const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const {
  crearProducto,
  obtenerProducto,
  obtenerProductos,
  borrarProducto,
} = require('../controllers/productos');
const {
  existeProductoPorId,
  existeCategoriaPorId,
} = require('../helpers/db-validators');

const router = Router();

router.get('/', obtenerProductos);

router.get(
  '/:id',
  [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id', custom(existeProductoPorId)),
    validarCampos,
  ],
  obtenerProducto
);

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatotio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo valido').isMongoId(),
    check('categoria', custom(existeCategoriaPorId)),
    validarCampos,
  ],
  crearProducto
);

router.put('/:id', [
  validarJWT,
  check('id', custom(existeProductoPorId)),
  validarCampos,
]);

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id', custom(existeProductoPorId)),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
