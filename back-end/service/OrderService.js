const crypto = require('crypto');
const UserService = require('./UserService');

class OrderService {
    constructor(db, userService) {
        this.client = db.sequelize;
        this.Cart = db.Cart;
        this.CartProduct = db.CartProduct;
        this.Order = db.Order;
        this.OrderProduct = db.OrderProduct;
        this.User = db.User;
        this.userService = userService;
    }

    async getAll(userId) {
        const orders = await this.Order.findAll({
            where: { userId: userId }
        });
        return orders;
    }

async createOrder(cartId, user) {
    // Find Cart
    const cart = await this.Cart.findOne({
     where: { id: cartId, isCheckedOut: false },
     include: [{ model: this.CartProduct, as: 'cartProducts' }],
    });

    if(!cart) {
     throw new Error("Cart not found or already checked out.")
    } 

    const orderNumber = crypto.randomBytes(4).toString('hex');

    let order = await this.Order.create({
         orderNumber: orderNumber,
         orderStatusId: 1,
         membershipId: user.membershipId,
         numOfProducts: cart.numOfProducts,
         totalAmount: cart.totalAmount,
         userId: cart.userId,
         cartId: cart.id, 
     });

     for(let cartProduct of cart.cartProducts) {
         await this.OrderProduct.create({
             productId: cartProduct.productId,
             orderId: order.id,
         });
     }

     cart.isCheckedOut = true;

     await cart.save();

     // Delete products from cartProduct to save space
     await this.CartProduct.destroy({
        where: { cartId: cartId },
    });

    // Update units and membership Status in user
   user.sumOfUnits += cart.numOfProducts;
   await cart.save();
   await this.userService.updateMembership(user);

     return order;
 }


}

module.exports = OrderService;