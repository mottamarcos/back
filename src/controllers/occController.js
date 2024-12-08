const db = require('../config/db');
const { createNotification } = require("../controllers/nfController");

const getOccurrencesOpened = async (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM Ocorrencia WHERE usuario_id = ? and status != "Concluída"';
  try {
    const result = await db.query(query, [id]);
    res.status(200).json({ success: true, occurrence: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao obter a ocorrência.' });
  }
};

const getOccAttended = async (req, res) => {
  const query = 'SELECT * FROM Ocorrencia WHERE status = "Concluída"';
  try {
    const [result] = await db.query(query); 
    // Retornando todas as ocorrências encontradas
    res.status(200).json({ success: true, occurrences: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao obter as ocorrências.' });
  }
};

const getOperationOcc = async (req, res) => {
  const query = 'SELECT * FROM Ocorrencia WHERE status != "Concluída"';
  try {
    const [result] = await db.query(query); 

    // Retornando todas as ocorrências encontradas
    res.status(200).json({ success: true, occurrences: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao obter as ocorrências.' });
  }
};

// Backend - Controller para criar a ocorrência
const createOccurrence = async (req, res) => {
  const { tipo_ocorrencia, descricao, localizacao, usuario_id } = req.body;

  // Criando a ocorrência
  const query = `
    INSERT INTO Ocorrencia (tipo_ocorrencia, descricao, status, localizacao, data_hora, usuario_id)
    VALUES (?, ?, 'Aberta', ?, NOW(), ?);
  `;
  try {
    const [result] = await db.query(query, [tipo_ocorrencia, descricao, localizacao, usuario_id]);

    if (result && result.insertId) {
      const ocorrencia_id = result.insertId;

      // Retornar a ocorrência criada
      res.status(201).json({
        success: true,
        occurrence: {
          ocorrencia_id,
          tipo_ocorrencia,
          descricao,
          status: 'Aberta',
          localizacao,
        }
      });

      await createNotification(
        'Aberta', 
        usuario_id, 
        ocorrencia_id,
        'Status da Ocorrência',
        `Ocorrência aberta, aguardando a sala de operações`,
      );

    } else {
      res.status(500).json({ success: false, message: 'Falha ao criar a ocorrência.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao criar a ocorrência.' });
  }
};

const updateStatus = async (req, res) => {
  const { ocorrencia_id, status } = req.body;
  const validStatuses = ['Aberta', 'Aguardando Resgate', 'Equipe a Caminho', 'Resgate em Progresso', 'Concluída'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: `O status '${status}' é inválido. Os status permitidos são: ${validStatuses.join(', ')}.`,
    });
  }

  try {
    // Verificar se o usuário existe
    const [rows] = await db.query("SELECT * FROM Ocorrencia WHERE ocorrencia_id = ?", [
      ocorrencia_id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Ocorrência não encontrada!" });
    }

    // Atualizar o usuário no banco de dados
    await db.query(
      `UPDATE Ocorrencia 
       SET status=?
       WHERE ocorrencia_id=?`,
      [status, ocorrencia_id]
    );

    await createNotification(
      status, 
      rows[0].usuario_id, 
      rows[0].ocorrencia_id,
      'Status da Ocorrência',
      `Sua ocorrência está ${status}`,
    );

    res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

module.exports = {
  getOccurrencesOpened,
  createOccurrence,
  getOperationOcc,
  updateStatus,
  getOccAttended,
};


