module.exports = (sequelize, DataTypes) => {
    const Volunteer = sequelize.define("Volunteer", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 100] // Adjust as needed
            }
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                len: [3, 100] // Adjust as needed
            }
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true
            }
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                is: /^([01]\d|2[0-3]):([0-5]\d)$/
            }
        },
        briefDescription: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 500] // Adjust as needed
            }
        },
        detailedDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [0, 1000] // Adjust as needed
            }
        },
        imageFile: {
            type: DataTypes.STRING(100), // Adjust size as needed
            allowNull: true
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
