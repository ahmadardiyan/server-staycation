var router = require('express').Router();
const adminController = require('../controllers/adminController');
const {upload} = require('../middlewares/multer');

router.get('/dashboard',adminController.viewDashboard);

// endpoint category
router.get('/category',adminController.viewCategory);
router.post('/category',adminController.createCategory);
router.put('/category',adminController.updateCategory);
router.delete('/category/:id',adminController.deleteCategory);

// endpoint bank
router.get('/bank',adminController.viewBank);
router.post('/bank',upload, adminController.createBank);

router.get('/item',adminController.viewItem);
router.get('/booking',adminController.viewBooking);

module.exports = router;
