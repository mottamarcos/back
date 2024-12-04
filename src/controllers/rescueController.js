const db = require('../config/db'); 

const createRescue = async (req, res) => {
    const { ocorrencia_id, viatura_id, detalhes } = req.body;

    // Validação de dados obrigatórios
    if (!ocorrencia_id || !viatura_id) {
      return res.status(400).json({ 
        message: "Os campos 'ocorrencia_id' e 'viatura_id' são obrigatórios." 
      });
    }
  
    try {
      // Cria o atendimento no banco de dados
      await db.execute(
        `INSERT INTO Atendimento (ocorrencia_id, viatura_id, detalhes) 
        VALUES (?, ?, ?)`,
        [ocorrencia_id, viatura_id, detalhes || null]
      );
  
      res.status(201).json({ 
        message: 'Atendimento criado com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao criar atendimento:', error);
      res.status(500).json({ 
        message: 'Erro interno ao criar o atendimento.' 
      });
    }
};

module.exports = {
    createRescue,
};