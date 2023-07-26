const { Categoria, Role, Usuario, Producto } = require('../models');

/**
 * The function `esRoleValido` checks if a given role exists in the database and throws an error if it
 * doesn't.
 * @param [rol] - The `rol` parameter is a string that represents a role.
 */
const esRoleValido = async (rol = '') => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

/**
 * The function checks if an email already exists in a database and throws an error if it does.
 * @param [correo] - The parameter "correo" is a string that represents an email address.
 */
const emailExiste = async (correo = '') => {
  // Verificar si el correo existe
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo: ${correo}, ya está registrado`);
  }
};

/**
 * The function checks if a user exists by their ID and throws an error if they don't.
 * @param id - The parameter `id` is the unique identifier of a user. It is used to search for a user
 * in the database by their ID.
 */
const existeUsuarioPorId = async (id) => {
  // Verificar si el correo existe
  const existeUsuario = await Usuario.findById(id);
  if (existeUsuario) {
    throw new Error(`El id no existe ${id}`);
  }
};

/**
 * The function checks if a category exists based on its ID and throws an error if it doesn't.
 * @param id - The parameter `id` is the identifier of a category. It is used to search for a category
 * in the database using the `Categoria.findById` method.
 */
const existeCategoriaPorId = async (id) => {
  const categoria = await Categoria.findById(id);
  if (!categoria) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existeProductoPorId = async (id) => {
  const categoria = await Producto.findById(id);
  if (!categoria) {
    throw new Error(`El id no existe ${id}`);
  }
};

const coleccionesPermitidas = async (coleccion, colecciones = []) => {
  if (!colecciones.includes(coleccion)) {
    throw new Error(`La coleccion ${coleccion} no es permitida`);
  }
  return true;
};

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermitidas,
};
