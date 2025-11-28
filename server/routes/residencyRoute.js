import express from "express";
import { createResidency, getAllResidencies, getResidency } from "../controllers/resdCntrl.js";

const router = express.Router()

//make a residency (to be modified)
router.post("/create", createResidency)

//get all residencies (to be modified)
router.get("/allresd", getAllResidencies)
//get a specific residencies (to be modified)
router.get("/:id", getResidency)

export {router as residencyRoute}