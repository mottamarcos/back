//usercontroller
const bcrypt = require("bcrypt");
const db = require('../config/db'); 

const getUserById = (req, res) => {
  const { id } = req.params;  
  db.execute('SELECT * FROM Usuario WHERE user_id = ?', [id])
    .then(([rows]) => {
      if (rows.length === 0) {
        res.status(404).json({ message: 'Usuário não encontrado!' }); 
      } else {
        res.status(200).json(rows[0]);  
      }
    })
    .catch((err) => {
      console.error('Erro na consulta ao banco:', err);
      res.status(500).json({ message: 'Erro interno no servidor.' });  // Erro do servidor
    });
};


// Lógica de registro
const registerUser = async (req, res) => {
  const { nome, email, senha, telefone, tipo_usuario } = req.body;

  // Verificar se todos os campos obrigatórios foram preenchidos
  if (!nome || !email || !senha || !tipo_usuario) {
    return res.status(400).json({ message: "Preencha todos os campos obrigatórios!" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Inserir o novo usuário no banco de dados
    await db.query(
      "INSERT INTO Usuario (nome, email, senha, telefone, tipo_usuario) VALUES (?, ?, ?, ?, ?)",
      [nome, email, hashedPassword, telefone || null, tipo_usuario]
    );

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error("Erro no registro:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email já está em uso!" });
    }
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

//Lógica de alteração
const updateUser = async (req, res) => {
  const { user_id, nome, email, telefone, tipo_usuario } = req.body;

  // Verificar se o ID do usuário foi fornecido
  if (!user_id) {
    return res.status(400).json({ message: "ID do usuário é obrigatório!" });
  }

  try {
    // Verificar se o usuário existe
    const [rows] = await db.query("SELECT * FROM Usuario WHERE user_id = ?", [
      user_id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Atualizar o usuário no banco de dados
    await db.query(
      `UPDATE Usuario 
       SET nome = COALESCE(?, nome), 
           email = COALESCE(?, email), 
           telefone = COALESCE(?, telefone), 
           tipo_usuario = COALESCE(?, tipo_usuario) 
       WHERE user_id = ?`,
      [nome, email, telefone, tipo_usuario, user_id]
    );

    res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};


module.exports = {
  getUserById,
  registerUser,
  updateUser,
};