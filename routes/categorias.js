const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignin } = require('../controllers/auth');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const {
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
  borrarCategoria,
} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', obtenerCategorias);

router.get(
  '/:id',
  [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id', custom(existeCategoriaPorId)),
    validarCampos,
  ],
  obtenerCategoria
);

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatotio').not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

router.put('/:id', [
  validarJWT,
  check('nombre', 'El nombre es obligatotio').not().isEmpty(),
  check('id', custom(existeCategoriaPorId)),
  validarCampos,
]);

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id', custom(existeCategoriaPorId)),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
