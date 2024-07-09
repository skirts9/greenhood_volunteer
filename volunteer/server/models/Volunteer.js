module.exports = (sequelize, DataTypes) => {
  const Volunteer = sequelize.define("Volunteer", {
    dateAvailable: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    serviceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50] // Ensure there's at least one character
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
        is: /^([01]\d|2[0-3]):([0-5]\d)$/ // Regex for HH:mm format
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
      type: DataTypes.STRING(255), // Increased size to accommodate longer filenames
      allowNull: true
    },
    contactInfo: {
      type: DataTypes.STRING(255), // Increased size for more flexibility
      allowNull: true
    },
    
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
