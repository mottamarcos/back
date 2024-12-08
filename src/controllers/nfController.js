const db = require('../config/db'); // Ajuste para o módulo de conexão com o banco

const getNotifications = async (req, res) => { 
  try {
    const userId = req.params.id; // Obtém o ID do usuário logado dos parâmetros da rota

    if (!userId) {
      return res.status(400).json({ error: 'O ID do usuário é obrigatório.' });
    }

    // Query para buscar notificações relacionadas ao usuário
    const query = `
      SELECT *
      FROM Notificacao 
      WHERE usuario_id = ? 
      ORDER BY data_hora DESC
    `;

    const [notifications] = await db.query(query, [userId]); // Executa a query com o ID do usuário

    // Retorna um array vazio caso nenhuma notificação seja encontrada
    res.json(notifications || []);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = {
  getNotifications,
};


async function createNotification(status, usuario_id, ocorrencia_id = null, titulo, mensagem) {
  const lida = false; // Define que a notificação não foi lida inicialmente
  const dataHora = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato 'YYYY-MM-DD HH:MM:SS'


  const query = `
      INSERT INTO Notificacao (mensagem, usuario_id, ocorrencia_id, data_hora, titulo, lida)
      VALUES (?, ?, ?, ?, ?, ?)
  `;

  try { 
      const [result] = await db.execute(query, [mensagem || status, usuario_id, ocorrencia_id, dataHora, titulo, lida]);
      return result.insertId; // Retorna o ID da notificação criada
  } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
  }  
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notificacao_id = req.params.id;
    const query = `
        UPDATE Notificacao
        SET lida = true
        WHERE notificacao_id = ?
    `;
    const [result] = await db.execute(query, [notificacao_id]);
  
    if (result.affectedRows > 0) {
        res.status(200).send({ message: 'Notificação marcada como lida' });
    } else {
        res.status(404).send({ message: 'Notificação não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).send({ message: 'Erro no servidor' });
  }
};


module.exports = {
  createNotification,
  markNotificationAsRead,
  getNotifications,
};
