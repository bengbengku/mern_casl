const axios = require('axios');

const rajaOngkirProvinsi = async (req, res) => {
  try {
    const { data } = await axios.get('https://api.rajaongkir.com/starter/province', {
      headers: {
        key: process.env.RAJA_ONGKIR_API_KEY,
      },
    });
    const { results } = data.rajaongkir;
    res.json(results);
  } catch (err) {
    if (err) throw new Error(err);
    console.log(err);
  }
};

const rajaOngkirCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`https://api.rajaongkir.com/starter/city?province=${id}`, {
      headers: {
        key: process.env.RAJA_ONGKIR_API_KEY,
      },
    });
    const { results } = data.rajaongkir;
    res.json(results);
  } catch (err) {
    if (err) throw new Error(err);
    console.log(err);
  }
};

const rajaOngkirCost = async (req, res) => {
  try {
    const { origin, destination, weight, courier } = req.body;
    const { data } = await axios.post(
      'https://api.rajaongkir.com/starter/cost',
      { origin, destination, weight, courier },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          key: process.env.RAJA_ONGKIR_API_KEY,
        },
      }
    );
    res.json(data);
  } catch (err) {
    return res.send(err);
  }
};

module.exports = { rajaOngkirProvinsi, rajaOngkirCity, rajaOngkirCost };
