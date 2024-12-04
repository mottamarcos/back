const db = require('../config/db'); 

const getVehicles = (req, res) => {
  db.execute('SELECT * FROM Viatura WHERE status = "Disponível"')
    .then(([rows]) => {
        res.status(200).json(rows);  
    })
    .catch((err) => {
      console.error('Erro na consulta ao banco:', err);
      res.status(500).json({ message: 'Erro interno no servidor.' });  // Erro do servidor
    });
};
  
module.exports = {
  getVehicles,
};