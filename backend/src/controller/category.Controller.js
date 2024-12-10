const CategoryService = require('../../database/categoryService');

class CategoryController {

    async getAllCategory(req, res) {
        try {
            const response = await CategoryService.getAllCategory()
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }


    async getOneCategory(req, res) {
        try {
            const { limit, page, filter, sort } = req.query
            const { categoryName } = req.body
            if (!categoryName) {
                return res.status(400).json({
                    status: 400,
                    msg: 'categoryName is required',
                    data: null
                })
            }
            const response = await CategoryService.getOneCategory(Number(limit) || 5, Number(page) || 0, sort, categoryName)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }
}

module.exports = new CategoryController;