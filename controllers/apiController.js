const Activity = require('../models/Activity')
const Booking = require('../models/Booking')
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


      res.status(200).json({
        hero,
        mostPicked
      })
    } catch {
      console.log('gagal;')
    }
  }
}