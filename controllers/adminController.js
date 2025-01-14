const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models') 
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const adminService = require('../services/adminService.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({ 
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', { categories })
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.render('admin/restaurant', { restaurant: data.restaurant }) 
    })
  },

  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories, 
          restaurant: restaurant.toJSON()
        })
      })
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      if(data['status'] === 'error'){
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true, nest: true })
    .then(users => res.render('admin/users', { users }))
  },

  toggleAdmin: async (req, res) => {
    //判斷是否能變更管理權限 (自己不能變更自己)
    // if (Number(req.params.id) === req.user.id) {
    //   req.flash('error_messages','禁止變更管理者權限')
    //   return res.redirect('/admin/users')
    // }
    //變更管理權限
    return User.findByPk(req.params.id)
    .then(async (user) => {
      if (user.email === 'root@example.com') {
        req.flash('error_messages','禁止變更管理者權限')
        return res.redirect('back')
      }
      user.isAdmin ? await user.update({isAdmin: false }) : await user.update({isAdmin: true })
      req.flash('success_messages','使用者權限變更成功')
      return res.redirect('/admin/users')
    })
  }
}


module.exports = adminController
