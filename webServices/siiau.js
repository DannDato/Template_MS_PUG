import 'dotenv/config';
import fetch from 'cross-fetch';

const ws = {};

ws.postData = async (ws_endpoint = '', data = {}) => {
  try {
    const response = await fetch(process.env.WS_URL + ws_endpoint, {
      method: 'POST',
      headers: {
        'Username': process.env.WS_USERNAME,
        'Password': process.env.WS_PASSWORD,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.error('Error en webservice:', error.message);
    return { error: 'Error de conexión con el webservice' };
  }
};

export default ws;