const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const crypto = require('crypto');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME, 
  process.env.ADMIN_USERNAME, 
  process.env.ADMIN_PASSWORD, 
  {
    host: process.env.HOST, 
    dialect: 'mysql'
  }
);

const db = {};
db.sequelize = sequelize;

async function createRoles(Role) {
  const count = await Role.count();

  // If roles exist in the db, dont create data
  if(count > 0) {
    return;
  }

  const roles = ['admin', 'user']
  for (let role of roles) {
    const [record, created] = await Role.findOrCreate({
      where: { role: role },
      defaults: { role: role }
    });
    if (created) {
      console.log("roles created");
    }
  }
}

async function createMemberships(Membership) {
  const count = await Membership.count();

  // If memberships exist in the db, dont create data
  if(count > 0) {
    return;
  }

  const memberships = [
    { type: 'bronze', discount: 0 },
    { type: 'silver', discount: 15 },
    { type: 'gold', discount: 30 },
  ];

  for (let membership of memberships) {
    const [record, created] = await Membership.findOrCreate({
      where: { type: membership.type },
      defaults: { discount: membership.discount },
    });

    if (created) {
        console.log("memberships created");
    }
  }
}

async function createDefaultAdmin(User) {
  const existingAdmin = await User.findOne({
    where: { email: 'admin@noroff.no' },
  });

  // dont create if admin exists
  if(existingAdmin) {
    return;
  }
  // Create Admin
  const [admin, created] = await User.findOrCreate ({
    where: { email: 'admin@noroff.no' },
    defaults: {
      firstname: 'Admin',
      lastname: 'Support',
      username: 'admin',
      password: 'P@ssword2023',
      email: 'admin@noroff.no',
      address: 'Online',
      phone: 911,
      membership_id: 1,
      role_id: 1
    },
  })

    if (created) {
      console.log("default Admin created");
    } else {
      console.log("default Admin already exists");
    }
}

async function createOrderStatus(OrderStatus) {
  const count = await OrderStatus.count();

  // If roles exist in the db, dont create data
  if(count > 0) {
    return;
  }

  const statusTypes = ['In progress', 'Ordered', 'completed']
  for (s of statusTypes ) {
    const [record, created] = await OrderStatus.findOrCreate({
      where: { typeOfStatus: s },
      defaults: { typeOfStatus: s }
    });

    if (created) {
      console.log("orderStatus hos been created");
    }
  }
}


fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
 
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

  
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// Create data after the models is loaded
db.sequelize.sync().then(async () => {
await createRoles(db.Role);
await createMemberships(db.Membership);
await createOrderStatus(db.OrderStatus);
await createDefaultAdmin(db.User);
}).catch((err) => { 
  console.error('Error when syncing with the database', err);
});



module.exports = db;
