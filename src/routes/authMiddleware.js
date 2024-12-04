const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(403).json({ message: "Acesso negado, token não fornecido!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona os dados do usuário no req para uso nas rotas
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido!" });
  }
};

module.exports = verifyToken;