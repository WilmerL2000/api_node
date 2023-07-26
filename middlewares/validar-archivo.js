/**
 * The function `validarArchivo` checks if there are any files in the request and returns an error
 * message if there are none.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request. It includes properties such as the request headers, query parameters, request body,
 * and any files that were uploaded.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as setting
 * the status code, sending JSON data, or redirecting the client to a different URL.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used to move to the next
 * middleware function after the current middleware function has completed its task.
 * @returns If there are no files in the request or if the 'archivo' file is missing, a response with
 * status code 400 and a JSON object containing the message 'No hay archivos' will be returned.
 */
const validarArchivo = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({ msg: 'No hay archivos' });
  }
  next();
};

module.exports = {
  validarArchivo,
};
