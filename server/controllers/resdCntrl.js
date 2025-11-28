import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

//create a residency
export const createResidency = asyncHandler(async (req, res)=> {
    //extract the data
    const {title, description, price, address, country, city, facilities, image, userEmail} = req.body.data

    console.log(req.body.data)

    try{
        //get all the data related to a residency
        const residency = await prisma.residency.create({
            data: {
                title, 
                description, 
                price, 
                address, 
                country, 
                city, 
                facilities, 
                image, 
                owner : {connect : {email: userEmail}},
            },
        });
        res.send({message: "Residency created successfully", residency});
    }catch(err){
        //a unique address that is already in our database is entered
        if (err.code == "P2002")
        {
            throw new Error("Residency already exists there")
        }
        throw new Error(err.message)
    }
});

//function to get all residencies
export const getAllResidencies = asyncHandler(async (req, res)=> {
    const residencies = await prisma.residency.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.send(residencies)
})

//function to get a specific residency
export const getResidency = asyncHandler(async (req, res)=>{
    //fetch id
    //params for using the URl to send parameters
    const { id } = req.params

    try{
        const residency = await prisma.residency.findUnique({
            where: { id },
        });
        res.send(residency);
    } catch(err){
        throw new Error(err.message);
    }
})