const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ocorrencia = sequelize.define('Ocorrencia', {
  ocorrencia_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo_ocorrencia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('Aberta', 'Em andamento', 'Concluída'),
    defaultValue: 'Aberta',
  },
  localizacao: {
    type: DataTypes.STRING,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  data_hora: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Ocorrencia',
  timestamps: false,
});

module.exports = Ocorrencia;
