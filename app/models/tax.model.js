module.exports = (sequelize, Sequelize) => {
  const Tax = sequelize.define("taxes", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
    },
    taxcode: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.BIGINT
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
    freezeTableName: true
  });

  return Tax;
};