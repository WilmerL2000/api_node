const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignin } = require('../controllers/auth');
const { validarJWT, validarCampos } = require('../middlewares');
const { crearCategoria } = require('../controllers/categorias');

const router = Router();

router.get('/');

router.get('/:id');

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatotio').not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

router.put('/:id');

router.delete('/:id');

module.exports = router;
