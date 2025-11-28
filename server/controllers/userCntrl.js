import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const createUser = asyncHandler(async (req, res) =>{
    console.log("Creating User");

    let {email} = req.body;

    //check if the user exists already
    const userExists = await prisma.user.findUnique({ where: {email: email}});
    //only create if not 
    if (!userExists) {
        const user = await prisma.user.create({ data: req.body });
        res.send({
            message: "User registered successfully",
            user: user,
        });
    }else res.status(201).send({ message: "User already registered" });
});

//function to book a visit to a residency
export const bookVisit = asyncHandler(async (req, res) =>{
    //get the email and date
    const {email, date} = req.body
    const {id} = req.params

    try{
        const alreadyBooked = await prisma.user.findUnique({
            //get all the booked visits made by the particular user
            where: {email},
            select: {bookedVisits: true}
        })

        if (alreadyBooked.bookedVisits.some((visits)=> visits.id === id)){
            res.status(400).json({message: "This residency is already booked by you"})
        }
        else{
            //if not booked by the user, book the visit
            await prisma.user.update({
                where: {email: email},
                data: {
                    //update the bookedVisits field and in that entry push a new entry with id(email), date(date)
                    bookedVisits: {push: {id, date}}
                }
            });
            res.send("Your visit is booked succesfully")
        }
    }catch(err){
        throw new Error(err.message)
    }

})

// function to get all bookings of a user
export const getAllBookings = asyncHandler(async (req, res) => {
    //get the email first
    const {email} = req.body
    try{
        const bookings = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true}
        })
        res.status(200).send(bookings)
    }catch(err){
        throw new Error(err.message)
    }
})

//function to cancel the bookings of a user
export const cancelBooking = asyncHandler(async (req, res) =>{
    const {email} = req.body
    const {id} = req.params

    try{

        const user = await prisma.user.findUnique({
            where: {email: email},
            select: {bookedVisits: true}
        })
        //iterate through the complete array of bookedvisits and check if the specific visit is equal to the id we defined above
        const index = user.bookedVisits.findIndex((visit)=> visit.id === id)

        //-1 is returned if the id does not match
        if (index === -1){
            res.status(404).json({message: "Booking not found"})
        } else{
            //remove the chosen bookedVisit
            user.bookedVisits.splice(index, 1)
            //update the document in mongodb
            await prisma.user.update({
                where: {email},
                data: {
                    bookedVisits: user.bookedVisits
                }
            })

            res.send("Booking cancelled successfully")
        }
    }catch(err){
        throw new Error(err.message);
    }
})

//function to add a residency to favourites of user
export const toFav = asyncHandler(async (req, res)=> {
    const {email} = req.body;
    const {rid} = req.params;

    try{
        const user = await prisma.user.findUnique({
            where: {email}
    })

    if (user.favResidenciesID.includes(rid)) {
        const updateUser = await prisma.user.update({
            where: {email},
            data: {
                //update the favourits array
                favResidenciesID :{
                    //set the favourites to that which is already there but filter out that which is rid
                    set: user.favResidenciesID.filter((id)=> id !== rid)
                }
            }
        });
        res.send({message: "Removed from facourites", user: updateUser})
    } else{
        const updateUser = await prisma.user.update({

            where: {email}, 
            data: {
                favResidenciesID: {
                    push: rid
                }
            }
        })
        res.send({message: "Updated favourites", user: updateUser})
    }
    }catch(err){
        throw new Error(err.message);
    }
})

//function to get all favourites
export const getAllFavourites = asyncHandler(async (req, res)=> {
    const { email } = req.body;

    try {
        const favResd = await prisma.user.findUnique({
            where: { email },
            select: {favResidenciesID: true},
        });
        res.status(200).send(favResd)
    }catch(err) {
        throw new Error(err.message);
    }
});