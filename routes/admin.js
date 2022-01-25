var router = require('express').Router();
const adminController = require('../controllers/adminController');
const {uploadSingle, uploadMultiple} = require('../middlewares/multer');

router.get('/signin', adminController.viewSignin)
router.post('/signin', adminController.actionSignin)

router.get('/dashboard',adminController.viewDashboard);

// endpoint category
router.get('/category',adminController.viewCategory);
router.post('/category',adminController.createCategory);
router.put('/category',adminController.updateCategory);
router.delete('/category/:id',adminController.deleteCategory);

// endpoint bank
router.get('/bank',adminController.viewBank);
router.post('/bank', uploadSingle, adminController.createBank);
router.put('/bank', uploadSingle, adminController.updateBank);
router.delete('/bank/:id',adminController.deleteBank);

// endpoint item
router.get('/item',adminController.viewItem);
router.get('/item/:id',adminController.showEditItem);
router.get('/item/show-image/:id',adminController.showImageItem);
router.post('/item', uploadMultiple, adminController.createItem);
router.put('/item/:id', uploadMultiple, adminController.updateItem);
router.delete('/item/:id', adminController.deleteItem);

router.get('/item/detail/:id',adminController.viewDetailItem);
router.post('/item/create/activity', uploadSingle, adminController.createActivity)
router.post('/item/create/feature', uploadSingle, adminController.createFeature)
router.put('/item/update/activity', uploadSingle, adminController.updateActivity)
router.put('/item/update/feature', uploadSingle, adminController.updateFeature)
router.delete('/item/:itemId/activity/:id', adminController.deleteActivity);
router.delete('/item/:itemId/feature/:id', adminController.deleteFeature);

router.get('/booking',adminController.viewBooking);

module.exports = router;
