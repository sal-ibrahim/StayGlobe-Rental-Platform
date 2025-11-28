import express from "express";

import { bookVisit, cancelBooking, createUser, getAllBookings, getAllFavourites, toFav } from "../controllers/userCntrl.js";
const router = express.Router()

//jwt is our middleware, the user must pass it before proceeding

//specify the post request to /register
router.post("/register", createUser)

//post a book when someone books a visit (to be modified)
router.post("/bookVisit/:id", bookVisit)

//post all bookings that a user makes
router.post("/allBookings", getAllBookings)

//remove a booking
router.post("/removeBooking/:id", cancelBooking)

//specify a post method for adding to favourites
router.post("/toFav/:rid", toFav)

//view all favourites
router.post("/allFav", getAllFavourites)


export {router as userRoute}