const router = require("express").Router()
const offerController = require("../controllers/OfferController")

router.post("/",offerController.createOffer)   //localhost:3800/offer
router.get("/",offerController.getAllOffers)   //localhost:3800/offer
router.get("/:id",offerController.getOfferById) ////localhost:3800/offer/offer/:id
router.put("/:id",offerController.updateOffer)      //localhost:3800/offer/:id
router.delete("/:id",offerController.deleteOffer)   //localhost:3800/offer/:id

module.exports = router  