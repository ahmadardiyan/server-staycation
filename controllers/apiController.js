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

      let categories = await Category.find()
        .select('_id name')
        .limit(3)
        .populate({
          path: 'itemId',
          select: '_id title country city isPopular sumBooking imageId',
          perDocumentLimit: 4,
          options: {sort: { sumBooking: -1 }},
          populate: {
            path: 'imageId',
            select: '_id imageUrl',
            perDocumentLimit: 1
          }
        })

      for (const category of categories) {
        for (const [index, value] of category.itemId.entries()) {
          const item = await Item.findOne({_id: value._id})
          item.isPopular = false
          
          if (index == 0) {
            item.isPopular = true
          }

          await item.save()
        }
      }

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.55,
        content: "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer"
      }
      
      res.status(200).json({
        hero,
        mostPicked,
        categories,
        testimonial
      })
    } catch {
      console.log(error)
      res.status(500).json({
        message: error.message
      })
    }
  }
}