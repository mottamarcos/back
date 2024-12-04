const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Usuario = db.define("Usuario", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING,
  },
  tipo_usuario: {
    type: DataTypes.ENUM("Admin", "Operador", "Militar", "Vítima"),
    allowNull: false,
  },
  recoveryCode: {
    type: DataTypes.INTEGER,
    allowNull: true, // Pode ser nulo até o código ser gerado
  },
  recoveryCodeExpires: {
    type: DataTypes.DATE,
    allowNull: true, // Pode ser nulo até o código ser gerado
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Usuario;
