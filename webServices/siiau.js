import 'dotenv/config';
import fetch from 'cross-fetch';

const ws = {};

ws.postData = async (ws_endpoint = '', data = {}) => {
  try {
    const url = `https://escolar.cucs.udg.mx/web-escolar/consultaWebService/validaUsuario/${data.codigo}/${data.nip}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error en webservice:', error.message);
    return { error: 'Error de conexión con el webservice' };
  }
};

export default ws;