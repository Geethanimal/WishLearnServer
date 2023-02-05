import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "../database";
 
export const comntRouter = express.Router();
comntRouter.use(express.json());
 
comntRouter.get("/", async (_req, res) => {
   try {
       const comnts = await collections.comnts.find({}).toArray();
       res.status(200).send(comnts);
   } catch (error:any) {
       res.status(500).send(error.message);
   }
});

comntRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const comnt = await collections.comnts.findOne(query);
  
        if (comnt) {
            res.status(200).send(comnt);
        } else {
            res.status(404).send(`Failed to find an comnt: ID ${id}`);
        }
  
    } catch (error) {
        res.status(404).send(`Failed to find an comnt: ID ${req?.params?.id}`);
    }
 });

 comntRouter.post("/", async (req, res) => {
    try {
        const comnt = req.body;
        const result = await collections.comnts.insertOne(comnt);
  
        if (result.acknowledged) {
            res.status(201).send(`Created a new comnt: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new comnt.");
        }
    } catch (error:any) {
        console.error(error);
        res.status(400).send(error.message);
    }
 });

 comntRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const comnt = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.comnts.updateOne(query, { $set: comnt });
  
        if (result && result.matchedCount) {
            res.status(200).send(`Updated an comnt: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an comnt: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an comnt: ID ${id}`);
        }
    } catch (error:any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });

 comntRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.comnts.deleteOne(query);
  
        if (result && result.deletedCount) {
            res.status(202).send(`Removed an comnt: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an comnt: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an comnt: ID ${id}`);
        }
    } catch (error:any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });