const Activity = require('../models/Activity');
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Booking = require('../models/Booking');
const Feature = require('../models/Feature');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Member = require('../models/Member');
const User = require('../models/Users');
const bcrypt = require('bcryptjs')
const fs = require('fs-extra');
const path = require('path');

module.exports = {

	viewSignin: async (req, res) => {
		try {
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMessage,
				status: alertStatus
			}

			if (req.session.user == null || req.session.user == undefined) {
				res.render('index', {
					alert,
					title: 'StayCation | Sign In'
				});
			} else {
				res.redirect('/admin/dashboard')
			}

		} catch (error) {
			res.redirect('/admin/signin')
		}
	},
	actionSignin: async (req, res) => {
		try {
			const {username, password} = req.body

			const user = await User.findOne({username: username})

			if (!user) {
				req.flash('alertMessage', 'user not found!');
				req.flash('alertStatus', 'danger');
				res.redirect('/admin/signin');
			}

			const isPasswordMatch = await bcrypt.compare(password, user.password)
			if (!isPasswordMatch) {
				req.flash('alertMessage', 'password is not match!');
				req.flash('alertStatus', 'danger');
				res.redirect('/admin/signin');
			}

			req.session.user = {
				id: user.id,
				username: user.username
			}
			res.redirect('/admin/dashboard')
		} catch (error) {
			res.redirect('/admin/signin')
		}
	},
	actionSignout: async (req, res) => {
		req.session.destroy()
		res.redirect('/admin/signin')
	},
	viewDashboard: async (req, res) => {
		try {
			const member = await Member.find()
			const item = await Item.find()
			const booking = await Booking.find()

			console.log(member)
			res.render('admin/dashboard/view_dashboard', {
				title: 'StayCation | Dashboard',
				user: req.session.user,
				member,
				item,
				booking
			});
		} catch (error) {
			res.redirect('/admin/dashboard')
		}

	},
	viewCategory: async (req, res) => {
		try {
			const category = await Category.find();
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMessage,
				status: alertStatus
			}
			res.render('admin/category/view_category', {
				category,
				alert,
				title: 'StayCation | Category',
				user: req.session.user
			});
		} catch (error) {
			res.redirect('admin/category');
		}
	},
	createCategory: async (req, res) => {
		try {
			let {
				name
			} = req.body;

			await Category.create({
				name
			});
			req.flash('alertMessage', 'Success create data category!');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/category');
		} catch (error) {

			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

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

			req.flash('alertMessage', 'Success updated data category!');
			req.flash('alertStatus', 'success');

			res.redirect('/admin/category');
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

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

			req.flash('alertMessage', 'Success deleted data category!');
			req.flash('alertStatus', 'success');

			res.redirect('/admin/category');
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect('/admin/category');
		}
	},
	viewBank: async (req, res) => {
		try {
			const bank = await Bank.find();

			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMessage,
				status: alertStatus
			}
			res.render('admin/bank/view_bank', {
				title: 'StayCation | Bank',
				alert,
				bank,
				user: req.session.user
			});
		} catch (error) {
			res.redirect('admin/bank');
		}
	},
	createBank: async (req, res) => {
		try {
			let {
				name,
				bankAccount,
				nameAccount
			} = req.body;

			await Bank.create({
				name,
				bankAccount,
				nameAccount,
				imageUrl: `images/${req.file.filename}`
			})
			req.flash('alertMessage', 'Success create data bank!');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/bank');
		} catch (error) {

			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect('/admin/bank');
		}
	},
	updateBank: async (req, res) => {
		try {
			const {
				id,
				name,
				bankAccount,
				nameAccount
			} = req.body;
			const bank = await Bank.findOne({
				_id: id
			});

			if (req.file == undefined) {
				bank.name = name;
				bank.bankAccount = bankAccount;
				bank.nameAccount = nameAccount;

				await bank.save();

				req.flash('alertMessage', 'Success updated data bank!');
				req.flash('alertStatus', 'success');

				res.redirect('/admin/bank');
			} else {
				fs.unlink(path.join(`public/${bank.imageUrl}`));

				bank.name = name;
				bank.bankAccount = bankAccount;
				bank.nameAccount = nameAccount;
				bank.imageUrl = `images/${req.file.filename}`;

				await bank.save();

				req.flash('alertMessage', 'Success updated data bank!');
				req.flash('alertStatus', 'success');

				res.redirect('/admin/bank');
			}

		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect('/admin/bank');
		}
	},
	deleteBank: async (req, res) => {
		try {
			const {
				id
			} = req.params;
			const bank = await Bank.findOne({
				_id: id
			});
			fs.unlink(path.join(`public/${bank.imageUrl}`));

			await bank.remove();

			req.flash('alertMessage', 'Success updated data bank!');
			req.flash('alertStatus', 'success');

			res.redirect('/admin/bank');
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect('/admin/bank');
		}
	},
	viewItem: async (req, res) => {
		try {
			const items = await Item.find()
				.populate({
					path: `imageId`,
					select: `id imageUrl`
				})
				.populate({
					path: `categoryId`,
					select: `id name`
				});
			const categories = await Category.find();
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMessage,
				status: alertStatus
			}

			res.render('admin/item/view_item', {
				title: 'StayCation | Item',
				categories,
				alert,
				items,
				action: 'view',
				user: req.session.user
			});
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect('/admin/item');
		}
	},
	createItem: async (req, res) => {
		try {
			const {
				title,
				price,
				city,
				categoryId,
				description
			} = req.body;
			if (req.files.length > 0) {

				const category = await Category.findOne({
					_id: categoryId
				});

				let newItem = {
					title,
					price,
					city,
					categoryId,
					description
				}

				const item = await Item.create(newItem);
				category.itemId.push({
					_id: item._id
				});
				await category.save();

				for (let i = 0; i < req.files.length; i++) {
					const imageSave = await Image.create({
						imageUrl: `images/${req.files[i].filename}`
					});
					item.imageId.push({
						_id: imageSave._id
					});
					await item.save();
				}

				req.flash('alertMessage', 'Success insert data item!');
				req.flash('alertStatus', 'success');

				res.redirect('/admin/item');
			}
		} catch (error) {
			// console.log(error);
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect('/admin/item');
		}
	},
	showImageItem: async (req, res) => {
		try {
			const {
				id
			} = req.params;
			const items = await Item.findOne({
					_id: id
				})
				.populate({
					path: `imageId`,
					select: `id imageUrl`
				});

			// console.log(items.imageId);

			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMessage,
				status: alertStatus
			}

			res.render('admin/item/view_item', {
				title: 'StayCation | Item',
				alert,
				items,
				action: 'show-image',
				user: req.session.user
			});

		} catch (error) {
			console.log(error);
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect('/admin/item');
		}
	},
	showEditItem: async (req, res) => {
		try {
			const {
				id
			} = req.params;
			const item = await Item.findOne({
					_id: id
				})
				.populate({
					path: `imageId`,
					select: `id imageUrl`
				})
				.populate({
					path: `categoryId`,
					select: `id name`
				});

			const categories = await Category.find();
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMessage,
				status: alertStatus
			}

			res.render('admin/item/view_item', {
				title: 'StayCation | Edit Item',
				alert,
				item,
				categories,
				action: 'edit-item',
				user: req.session.user
			});

		} catch (error) {
			console.log(error);
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect('/admin/item');
		}
	},
	updateItem: async (req, res) => {
		try {
			const {
				id
			} = req.params;
			const {
				title,
				price,
				city,
				categoryId,
				description
			} = req.body;
			const item = await Item.findOne({
					_id: id
				})
				.populate({
					path: `imageId`,
					select: `id imageUrl`
				})
				.populate({
					path: `categoryId`,
					select: `id name`
				});

			if (req.files.length > 0) {
				for (let i = 0; i < item.imageId.length; i++) {
					const imageUpdate = await Image.findOne({
						_id: item.imageId[i]._id
					});
					await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
					imageUpdate.imageUrl = `images/${req.files[i].filename}`;
					await imageUpdate.save();
				}
			}

			item.title = title;
			item.price = price;
			item.city = city;
			item.categoryId = categoryId;
			item.description = description;
			await item.save();

			req.flash('alertMessage', 'Success update data item!');
			req.flash('alertStatus', 'success');

			res.redirect('/admin/item');
		} catch (error) {
			console.log(error);
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect('/admin/item');
		}
	},
	deleteItem: async (req, res) => {
		try {
			const {
				id
			} = req.params;
			const item = await Item.findOne({
				_id: id
			}).populate('imageId');

			for (let i = 0; i < item.imageId.length; i++) {
				Image.findOne({
					_id: item.imageId[i]._id
				}).then(image => {
					fs.unlink(path.join(`public/${image.imageUrl}`));
					image.remove();
				}).catch((error) => {
					console.log(error);
					req.flash('alertMessage', `${error.message}`);
					req.flash('alertStatus', 'danger');

					res.redirect('/admin/item');
				})
			}

			await item.remove();
			req.flash('alertMessage', 'Success delete data item!');
			req.flash('alertStatus', 'success');

			res.redirect('/admin/item');

		} catch (error) {
			console.log(error);
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect('/admin/item');
		}
	},
	viewDetailItem: async (req, res) => {
		const itemId = req.params.id
		try {
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMessage,
				status: alertStatus
			}

			const features = await Feature.find({
				itemId: itemId
			})
			const activities = await Activity.find({
				itemId: itemId
			})


			res.render('admin/item/detail_item/view_detail_item', {
				title: 'StayCation | Detail Item',
				alert,
				itemId,
				features,
				activities,
				user: req.session.user
			});
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect('/admin/item');
		}
	},
	createFeature: async (req, res) => {
		let {
			name,
			qty,
			itemId
		} = req.body;
		try {
			if (!req.file) {
				req.flash('alertMessage', 'data image not found!');
				req.flash('alertStatus', 'dange');
				res.redirect(`/admin/item/detail/${itemId}`);
			}

			const feature = await Feature.create({
				name,
				qty,
				itemId,
				imageUrl: `images/${req.file.filename}`
			})

			const item = await Item.findOne({
				_id: itemId
			})
			item.featureId.push({
				_id: feature._id
			})
			await item.save()
			req.flash('alertMessage', 'Success create feature!');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/detail/${itemId}`);
		} catch (error) {

			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},
	updateFeature: async (req, res) => {
		const {
			id,
			name,
			qty,
			itemId
		} = req.body;
		console.log(itemId)
		try {
			const feature = await Feature.findOne({
				_id: id
			});

			if (req.file == undefined) {
				feature.name = name;
				feature.qty = qty;

				await feature.save();

				req.flash('alertMessage', 'Success updated data feature!');
				req.flash('alertStatus', 'success');

				res.redirect(`/admin/item/detail/${itemId}`);
			} else {
				fs.unlink(path.join(`public/${feature.imageUrl}`));

				feature.name = name;
				feature.qty = qty;
				feature.imageUrl = `images/${req.file.filename}`;

				await feature.save();

				req.flash('alertMessage', 'Success updated data feature!');
				req.flash('alertStatus', 'success');

				res.redirect(`/admin/item/detail/${itemId}`);
			}

		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},
	deleteFeature: async (req, res) => {
		const {
			id,
			itemId
		} = req.params;
		try {
			const feature = await Feature.findOne({
				_id: id
			});

			const item = await Item.findOne({_id: itemId}).populate('featureId')
			for(let value of item.featureId) {
				if (value._id.toString() === feature._id.toString()){
					item.featureId.pull({_id: feature._id})
					await item.save()
				}
			}
			fs.unlink(path.join(`public/${feature.imageUrl}`));
			await feature.remove();

			req.flash('alertMessage', 'Success delete data feature!');
			req.flash('alertStatus', 'success');

			res.redirect(`/admin/item/detail/${itemId}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},
	createActivity: async (req, res) => {
		let {
			name,
			type,
			itemId
		} = req.body;
		try {
			if (!req.file) {
				req.flash('alertMessage', 'data image not found!');
				req.flash('alertStatus', 'dange');
				res.redirect(`/admin/item/detail/${itemId}`);
			}

			const activity = await Activity.create({
				name,
				type,
				itemId,
				imageUrl: `images/${req.file.filename}`
			})

			const item = await Item.findOne({
				_id: itemId
			})
			item.activityId.push({
				_id: activity._id
			})
			await item.save()
			req.flash('alertMessage', 'Success create activity!');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/detail/${itemId}`);
		} catch (error) {

			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},
	updateActivity: async (req, res) => {
		const {
			id,
			name,
			type,
			itemId
		} = req.body;
		console.log(itemId)
		try {
			const activity = await Activity.findOne({
				_id: id
			});

			if (req.file == undefined) {
				activity.name = name;
				activity.type = type;

				await activity.save();

				req.flash('alertMessage', 'Success updated data activity!');
				req.flash('alertStatus', 'success');

				res.redirect(`/admin/item/detail/${itemId}`);
			} else {
				fs.unlink(path.join(`public/${activity.imageUrl}`));

				activity.name = name;
				activity.qty = qty;
				activity.imageUrl = `images/${req.file.filename}`;

				await activity.save();

				req.flash('alertMessage', 'Success updated data activity!');
				req.flash('alertStatus', 'success');

				res.redirect(`/admin/item/detail/${itemId}`);
			}

		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},
	deleteActivity: async (req, res) => {
		const {
			id,
			itemId
		} = req.params;
		try {
			const activity = await Activity.findOne({
				_id: id
			});

			const item = await Item.findOne({_id: itemId}).populate('activityId')
			for(let value of item.activityId) {
				if (value._id.toString() === activity._id.toString()){
					item.activityId.pull({_id: activity._id})
					await item.save()
				}
			}
			fs.unlink(path.join(`public/${activity.imageUrl}`));
			await activity.remove();

			req.flash('alertMessage', 'Success delete data activity!');
			req.flash('alertStatus', 'success');

			res.redirect(`/admin/item/detail/${itemId}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');

			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},
	viewBooking: async (req, res) => {
		try {
			const booking = await Booking.find().populate('memberId').populate('bankId');
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMessage,
				status: alertStatus
			}
			
			res.render('admin/booking/view_booking', {
				title: 'StayCation | Booking',
				booking,
				alert,
				user: req.session.user
			});
		} catch (error) {
			res.redirect('/admin/booking')
		}
	},
	viewBookingById: async (req, res) => {
		const {id} = req.params;
		try {
			const booking = await Booking.findOne({_id: id}).populate('memberId').populate('bankId');
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMessage,
				status: alertStatus
			}
			res.render('admin/booking/view_detail_booking', {
				title: 'StayCation | Detail Booking',
				booking,
				alert,
				user: req.session.user
			});
		} catch (error) {
			res.redirect('/admin/booking')
		}
	},
	actionConfirmBooking: async(req, res) => {
		const {id} = req.params;
		try {
			const booking = await Booking.findOne({_id: id}).populate('memberId').populate('bankId')
			booking.payments.status = "Paid"
			await booking.save()

			req.flash('alertMessage', 'Success confirmed booking!');
			req.flash('alertStatus', 'success');

			res.redirect(`/admin/booking/${id}`)
		} catch (error) {
			res.redirect(`/admin/booking/${id}`)
		}
	},
	actionRejectBooking: async(req, res) => {
		const {id} = req.params;
		try {
			const booking = await Booking.findOne({_id: id}).populate('memberId').populate('bankId')
			booking.payments.status = "Canceled"
			await booking.save()

			req.flash('alertMessage', 'Success canceled booking!');
			req.flash('alertStatus', 'success');

			res.redirect(`/admin/booking/${id}`)
		} catch (error) {
			res.redirect(`/admin/booking/${id}`)
		}
	}
}