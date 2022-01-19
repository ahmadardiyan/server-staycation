const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Feature = require('../models/Feature')
const Item = require('../models/Item');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
	viewDashboard: (req, res) => {
		res.render('admin/dashboard/view_dashboard', {
			title: 'StayCation | Dashboard'
		});
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
				title: 'StayCation | Category'
			});
		} catch (error) {
			res.render('admin/category');
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
				bank
			});
		} catch (error) {
			res.render('admin/bank');
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
				action: 'view'
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
				action: 'show-image'
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
				action: 'edit-item'
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

			res.render('admin/item/detail_item/view_detail_item', {
				title: 'StayCation | Detail Item',
				alert,
				itemId,
				features
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
	viewBooking: (req, res) => {
		res.render('admin/booking/view_booking', {
			title: 'StayCation | Booking'
		});
	}
}