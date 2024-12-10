const client = require('./database');

class manageProduct{
    constructor(){}

    addProduct(){}

    updateProduct(){}

    deleteProduct(){}

    async fetchProduct(quantity=10){
        return new Promise((resolve, reject) => {
            client.query(
                `SELECT * FROM product`, 
                [quantity],
                (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        });
                    } else {
                        resolve({
                            status: 200,
                            msg: 'Fetch success',
                            data: res.rows
                        });
                    }
                }
            );
        });
    }
}

module.exports = new manageProduct;