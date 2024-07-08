module.exports = (sequelize, DataTypes) => {
  const Volunteer = sequelize.define("Volunteer", {
    dateAvailable: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      validate: {
        isDate: true
      }
    },
    serviceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [0, 50]
      }
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    timeAvailable: {
      type: DataTypes.TIME,
      allowNull: true,
      validate: {
        is: /^([01]\d|2[0-3]):([0-5]\d)$/
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    imageFile: {
      type: DataTypes.STRING(100), // Adjust size as needed
      allowNull: true
    },
    contactInfo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Volunteers'
  });

  Volunteer.associate = (models) => {
    Volunteer.belongsTo(models.User, {
      foreignKey: "userId",
      as: 'user'
    });
  };

  return Volunteer;
};
