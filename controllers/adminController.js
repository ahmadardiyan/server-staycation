const Category = require('../models/Category');

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

			req.flash('alertMessage', 'Success create data category!' );
			req.flash('alertStatus', 'success' );

			await Category.create({ name });
			res.redirect('/admin/category');
		} catch(error) {

			req.flash('alertMessage', `$error.message` );
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

			req.flash('alertMessage', `$error.message` );
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
			req.flash('alertMessage', `$error.message` );
			req.flash('alertStatus', 'danger' );

			res.redirect('/admin/category');
		}
	},
	viewBank: (req, res) => {
		res.render('admin/bank/view_bank',{
			title : 'StayCation | Bank'
		});
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