const Activity = require('../models/Activity')
const Bank = require('../models/Bank')
const Booking = require('../models/Booking')
const Category = require('../models/Category')
const Item = require('../models/Item')
const Member = require('../models/Member')

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
  },
  detailPage : async (req, res) => {
    try {
      const { id } = req.params
      const item = await Item.findOne({_id: id})
        .populate(({path: 'imageId', select: '_id imageUrl'}))
        .populate(({path: 'featureId', select: '_id name qty imageUrl'}))
        .populate(({path: 'activityId', select: '_id name type imageUrl'}))

      const bank = await Bank.find().select('_id name bankAccount nameAccount imageUrl')

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.55,
        content: "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer"
      }

      // console.log(item)
      res.status(200).json({
        item,
        bank,
        testimonial
      })

    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: error.message
      })
    }
  },
  booking : async (req, res) => {
    try {

      const {
        itemId,
        firstName,
        lastName,
        email,
        phone,
        duration,
        startDate,
        endDate,
        bankFrom,
        accountHolder
      } = req.body
      
      if (!req.file) {
        return res.status(400).json({
          message: 'file proof payment not found, please upload file!'
        })
      }

      if (         
        itemId === undefined ||
        firstName === undefined ||
        lastName === undefined ||
        email === undefined ||
        phone === undefined ||
        duration === undefined ||
        startDate === undefined ||
        endDate === undefined ||
        bankFrom === undefined ||
        accountHolder === undefined
        ) {
          return res.status(400).json({
            message: 'field is empty, please insert data'
          })
        }
      
      const item = await Item.findOne({_id: itemId})

      if (!item) {
        return res.status(404).json({
          message: 'data item is not found'
        })
      }

      item.sumBooking += 1
      await item.save()

      const member = await Member.create({
        firstName,
        lastName,
        email,
        phone
      })

      const invoice = Math.floor(1000000 + Math.random() * 9000000)

      const total = item.price * duration
      const tax = total * 0.10

      const newBooking = {
        startDate,
        endDate,
        invoice,
        itemId: {
          _id: item._id,
          title: item.title,
          price: item.price,
          duration
        },
        total: total + tax,
        memberId: member.id,
        payments: {
          proofPayment: `/images/${req.file.filename}`,
          bankFrom,
          status: 'Proses',
          accountHolder
        }
      }

      const booking = await Booking.create(newBooking)

      return res.status(200).json({
        message: 'insert data successfuly',
        booking
      })

    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: error.message
      })
    }
  }
}