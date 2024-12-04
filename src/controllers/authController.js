const bcrypt = require("bcrypt");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // Verifique o caminho correto do modelo

// Enviar código de recuperação
const sendRecoveryCode = async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar se o usuário existe no banco de dados
    const [rows] = await db.query("SELECT * FROM Usuario WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Gerar o código de recuperação de 6 dígitos
    const recoveryCode = crypto.randomInt(100000, 999999);

    // Definir o tempo de expiração para 15 minutos a partir de agora
    const recoveryCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Atualizar as colunas recoveryCode e recoveryCodeExpires no banco
    await db.query(
      "UPDATE Usuario SET recoveryCode = ?, recoveryCodeExpires = ? WHERE email = ?",
      [recoveryCode, recoveryCodeExpires, email]
    );

    // Configurar o envio do e-mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código de Recuperação de Senha",
      text: `Seu código de recuperação é: ${recoveryCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Código de recuperação enviado para o e-mail." });
  } catch (error) {
    console.error(error);  // Log do erro
    res.status(500).json({ error: "Erro ao enviar código de recuperação." });
  }
};


// Resetar senha
const resetPassword = async (req, res) => {
  const { email, recoveryCode, newPassword } = req.body;

  try {
    // Verificar se o usuário existe
    const [rows] = await db.query("SELECT * FROM Usuario WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const user = rows[0];

    // Verificar se o código de recuperação é válido
    if (user.recoveryCode !== parseInt(recoveryCode) || new Date(user.recoveryCodeExpires) < new Date()) {
      return res.status(400).json({ message: "Código de recuperação inválido ou expirado." });
    }

    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar a senha no banco
    await db.query("UPDATE Usuario SET senha = ?, recoveryCode = NULL, recoveryCodeExpires = NULL WHERE email = ?", [hashedPassword, email]);

    res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao redefinir senha." });
  }
};

// Lógica de login
const login = async (req, res) => {
  const { email, senha } = req.body;

  // Verificação de campos obrigatórios
  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios!" });
  }

  try {
    // Verificação do usuário no banco de dados
    const [rows] = await db.query("SELECT * FROM Usuario WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    const usuario = rows[0];

    // Verificação da senha
    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    // Remover a senha do objeto de usuário antes de retornar
    const { senha: _, ...usuarioSemSenha } = usuario;

    // Gerar o token JWT
    const token = jwt.sign(
      { user_id: usuario.user_id, email: usuario.email }, // Dados úteis no token
      process.env.JWT_SECRET, // Segredo para a assinatura do token
      { expiresIn: '1h' } // Tempo de expiração do token
    );

    // Retornar o usuário e o token
    return res.status(200).json({
      message: "Login bem-sucedido!",
      usuario: usuarioSemSenha,
      token: token, // Incluindo o token no retorno
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

module.exports = {
  sendRecoveryCode,
  resetPassword,
  login,
};
