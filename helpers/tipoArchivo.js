// const path = require('path');
import path from 'path';
function tipoArchivo(nombre) {
  const ext = path.extname(nombre).toLowerCase();

  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
    return 'imagen';
  }

  if (ext === '.pdf') {
    return 'pdf';
  }

  return 'otro';
}
export default tipoArchivo;
// module.exports = tipoArchivo;
