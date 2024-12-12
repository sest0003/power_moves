const { success } = require("jsend");
const crypto = require('crypto');

class PopulateService {
    constructor(db) {
        this.client = db.sequelize;
        this.Product = db.Product;
        this.Brand = db.Brand;
        this.Category = db.Category;
        this.Membership = db.Membership;
        this.User = db.User;
        this.Role = db.Role;
        this.OrderStatus = db.OrderStatus;
    }

 async populateDatabase() {
    try {

      const existingProducts = await this.Product.findAll();
        if(existingProducts.length > 0) {
          return {success: false, message: 'the database already contains products.'} 
        }

    // Create data 
    await createRoles(this.Role);
    await createMemberships(this.Membership);
    await createOrderStatus(this.OrderStatus);
    await createDefaultAdmin(this.User);
  
    // Fetch Data
    const productData = await fetchApiCall();

    if (!productData) {
        throw new Error('found no data via the nordoff api.')
    }
   
    for (const product of productData) {
       // Fetch Brand
        const [brand] = await this.Brand.findOrCreate({
            where: { name: product.brand }
        });

        console.log("brand " + brand);
        
     // Fetch Category
        const [category] = await this.Category.findOrCreate({
            where: { name: product.category }
        });

        console.log("category " + category);

        await this.Product.create({
            name: product.name,
            description: product.description,
            imageUrl: product.imgurl,
            unitPrice: product.price,
            stock: product.quantity,
            isDeleted: false,
            brandId: brand.id,
            categoryId: category.id,
        });
    }
    return { success: true, message: "Database populated successfully" };
    } catch (error) {
      return { success: false, message: `error occured while populating database ${error.message}` };
    }
  }


}




async function fetchApiCall() {
    try { 
     const response = await fetch('http://backend.restapi.co.za/items/products/')
    console.log(response);
     if (!response.ok) {
        throw new Error('API request failed')
     }
     
     const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Fetch error', error);
      return null;
    }
  };

  async function createRoles(Role) {
    const count = await Role.count();
  
    // If roles exist in the db, dont create data
    if(count > 0) {
      return true;
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
  
    // Hashing password
    const salt = crypto.randomBytes(16).toString('hex');
    const password = 'P@ssword2023';
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256');
  
  
    // dont create if admin exists
    if(existingAdmin) {
      return true;
    }
    // Create Admin
    const [admin, created] = await User.findOrCreate ({
      where: { email: 'admin@noroff.no' },
      defaults: {
        firstname: 'Admin',
        lastname: 'Support',
        username: 'admin',
        password: hashedPassword,
        salt: salt,
        email: 'admin@noroff.no',
        adress: 'Online',
        phone: 911,
        membershipId: 1,
        roleId: 1,
        sumOfUnits: 0,
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
      return true;
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
  

module.exports = PopulateService;