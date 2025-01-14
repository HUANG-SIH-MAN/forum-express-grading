const db = require('../models')
const Category = db.Category
const adminService = require('../services/adminService')

let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            return res.render('admin/categories', { 
              categories: categories, 
              category: category.toJSON() 
            })
          })
      } else {
        return res.render('admin/categories', { categories: categories })
      }
    })
  },
  postCategory: (req, res) => {
    adminService.postCategory(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res) => {
    adminService.putCategory(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res) => {
    adminService.deleteCategory(req, res, data => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/categories')
      }
      
    })
  }
}
module.exports = categoryController