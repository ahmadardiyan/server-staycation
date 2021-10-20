const Category = require('../models/Category');
const Bank = require('../models/Bank');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
	viewDashboard: (req, res) => {
		res.render('admin/dashboard/view_dashboard', {
			title : 'StayCation | Dashboard'
		});
	},
	viewCategory: async (req, res) => {
		try {
			const category = await Category.find();
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message : alertMessage,
				status : alertStatus
			}
			res.render('admin/category/view_category', {
				category,
				alert,
				title : 'StayCation | Category'
			});
		} catch(error) {
			res.render('admin/category');
		}
	},
	createCategory: async (req, res) => {
		try {
			let { name } = req.body;

			await Category.create({ name });
			req.flash('alertMessage', 'Success create data category!' );
			req.flash('alertStatus', 'success' );
			res.redirect('/admin/category');
		} catch(error) {

			req.flash('alertMessage', `${error.message}` );
			req.flash('alertStatus', 'danger' );

			res.redirect('/admin/category');
		}
	},
	updateCategory: async (req, res) => {
		try {
			const {
				id,
				name
			} = req.body;
			const category = await Category.findOne({
				_id: id
			});

			category.name = name;
			await category.save();

			req.flash('alertMessage', 'Success updated data category!' );
			req.flash('alertStatus', 'success' );

			res.redirect('/admin/category');
		} catch(error) {
			req.flash('alertMessage', `${error.message}` );
			req.flash('alertStatus', 'danger' );

			res.redirect('/admin/category');
		}
	},
	deleteCategory: async (req, res) => {
		try {
			const {
				id
			} = req.params;
			const category = await Category.findOne({
				_id: id
			});
			await category.remove();

			req.flash('alertMessage', 'Success deleted data category!' );
			req.flash('alertStatus', 'success' );

			res.redirect('/admin/category');
		} catch(error) {
			req.flash('alertMessage', `${error.message}` );
			req.flash('alertStatus', 'danger' );

			res.redirect('/admin/category');
		}
	},
	viewBank: async (req, res) => {
		try {
			const bank = await Bank.find();

			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message : alertMessage,
				status : alertStatus
			}
			res.render('admin/bank/view_bank',{
				title : 'StayCation | Bank',
				alert,
				bank
			});
		} catch(error) {
			res.render('admin/bank');
		}
	},
	createBank: async (req, res) => {
		try {
			let { name, bankAccount, nameAccount } = req.body;

			await Bank.create({
				name,
				bankAccount,
				nameAccount,
				imageUrl : `images/${req.file.filename}`
			})
			req.flash('alertMessage', 'Success create data bank!' );
			req.flash('alertStatus', 'success' );
			res.redirect('/admin/bank');
		} catch(error) {

			req.flash('alertMessage', `${error.message}` );
			req.flash('alertStatus', 'danger' );

			res.redirect('/admin/bank');
		}
	},
	updateBank: async (req, res) => {
		try {
			const { id, name, bankAccount, nameAccount } = req.body;
			const bank = await Bank.findOne({_id: id});

			if (req.file == undefined) {
				bank.name = name;
				bank.bankAccount = bankAccount;
				bank.nameAccount = nameAccount;

				await bank.save();

				req.flash('alertMessage', 'Success updated data bank!' );
				req.flash('alertStatus', 'success' );

				res.redirect('/admin/bank');
			} else {
				fs.unlink(path.join(`public/${bank.imageUrl}`));

				bank.name = name;
				bank.bankAccount = bankAccount;
				bank.nameAccount = nameAccount;
				bank.imageUrl = `images/${req.file.filename}`;

				await bank.save();

				req.flash('alertMessage', 'Success updated data bank!' );
				req.flash('alertStatus', 'success' );

				res.redirect('/admin/bank');
			}

		} catch (error) {
			req.flash('alertMessage', `${error.message}` );
			req.flash('alertStatus', 'danger' );

			res.redirect('/admin/bank');
		}
	},
	viewItem: (req, res) => {
		res.render('admin/item/view_item', {
			title : 'StayCation | Item'
		});
	},
	viewBooking: (req, res) => {
		res.render('admin/booking/view_booking',{
			title : 'StayCation | Booking'
		});
	}
}