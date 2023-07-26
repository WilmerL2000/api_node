const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * The function `subirArchivo` is a JavaScript function that uploads a file to a specified folder with
 * optional validation for allowed file extensions.
 * @param files - An object containing the file to be uploaded. It should have a property named
 * "archivo" which represents the file to be uploaded.
 * @param [extensionesValidas] - An array of valid file extensions. By default, it includes 'png',
 * 'jpg', 'jpeg', and 'gif'.
 * @param [carpeta] - The `carpeta` parameter is a string that represents the folder where the uploaded
 * file will be stored. It is an optional parameter, and if not provided, the file will be stored in
 * the root of the "uploads" folder.
 * @returns The function `subirArchivo` returns a Promise.
 */
const subirArchivo = (
  files,
  extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'],
  carpeta = ''
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;

    const nombreCortado = archivo.nombre.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    if (!extensionesValidas.includes(extension)) {
      return reject(`La extension ${extension} no es permitida`);
    }

    const nombreTemporal = uuidv4() + '.' + extension;
    uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);

    archivo.mv(uploadPath, function (err) {
      if (err) {
        return reject(err);
      }

      resolve(nombreTemporal);
    });
  });
};

module.exports = {
  subirArchivo,
};
