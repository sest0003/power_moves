const crypto = require('crypto');

class CartService {
    constructor(db, userService, productService) {
        this.client = db.sequelize;
        this.Cart = db.Cart;
        this.CartProduct = db.CartProduct;
        this.Order = db.Order;
        this.OrderProduct = db.OrderProduct;
        this.User = db.User;
        this.Product = db.Product;
        this.userService = userService;
        this.productService = productService;
    }

    async getOne(id) {
        return this.Cart.findOne({
            where: {id: id}
        })
    }

    async addProductToCart(userId, productId, units) {

        // Find product in database
        const product = await this.productService.getOne(productId);
    
        if (!product) {
            return {message: "No product was found"};
        }

        if(product.stock < units) {
            return {message: "Not enough in stock."};
        } 

         // Find User
        const user = await this.Cart.findOne({
            where: { id: userId }
        });

        if(!user) {
            return {message: "you must login to add products to your cart"};
        } 

        // Try to find existing cart
        const cart = await this.Cart.findOne({ where: { userId: userId}, });
        
        // Calculate Discount
        const discount = user.Membership ? user.Membership.discount : 0;
        const discountedPrice = this.calculateDiscount(product.unitPrice, discount)
       
        // Create cart
        if(!cart) {
            cart = await this.Cart.create({
                userId: user.id,
                isCheckedOut: false,
                numOfProducts: units,
                totalAmount: discountedPrice * units,
            });
    
        // Update existing cart
        } else {
                let convUnits = parseInt(units, 10);
                cart.numOfProducts += convUnits;
                cart.totalAmount += discountedPrice * units;
                cart.isCheckedOut = false;
                await cart.save();
                }

        // Add products to cart
        const cartProducts = [];
        for(let i = 0; i < units; i++) {
            cartProducts.push({
                productId: product.id,
                cartId: cart.id,
            });
        }

        // BulkCreate insertion for a more effectiv insertion
        await this.CartProduct.bulkCreate(cartProducts);

        // Update stock i product
        productService.updateStock(productId, units);
            
        return cart;
    }


     calculateDiscount(unitPrice, discount) {
        if(discount < 0 || discount > 100){
            throw new Error('Invalid discount value');
        }
        return unitPrice * (1 - discount / 100)
      }


  }

  



module.exports = CartService;