const Activity = require('../models/Activity')
const Booking = require('../models/Booking')
const Category = require('../models/Category')
const Item = require('../models/Item')

module.exports = {
  landingPage : async (req, res) => {
    try {

      const city = await Item.find()
      const traveler = await Booking.find()
      const treasure = await Activity.find()

      const hero = {
        city: city.length,
        treasure: treasure.length,
        traveler: traveler.length
      }

      const mostPicked = await Item.find()
        .select('_id title country city price unit imageId')
        .limit(5)
        .populate({path: 'imageId', select: '_id imageUrl'})

      const categories = await Category.find()
        .select('_id name')
        .limit(3)
        .populate({
          path: 'itemId',
          perDocumentLimit: 4,
          select: '_id title country city isPopular imageId',
          populate: {
            path: 'imageId',
            select: '_id imageUrl',
            perDocumentLimit: 1
          }
        })

      res.status(200).json({
        hero,
        mostPicked,
        categories
      })
    } catch {
      console.log('gagal;')
    }
  }
}