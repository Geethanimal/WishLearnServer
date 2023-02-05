import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "../database";
 
export const posterRouter = express.Router();
posterRouter.use(express.json());
 
posterRouter.get("/", async (_req, res) => {
   try {
       const posters = await collections.posters.find({}).toArray();
       res.status(200).send(posters);
   } catch (error:any) {
       res.status(500).send(error.message);
   }
});

posterRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const poster = await collections.posters.findOne(query);
  
        if (poster) {
            res.status(200).send(poster);
        } else {
            res.status(404).send(`Failed to find an poster: ID ${id}`);
        }
  
    } catch (error) {
        res.status(404).send(`Failed to find an poster: ID ${req?.params?.id}`);
    }
 });

 posterRouter.post("/", async (req, res) => {
    try {
        const poster = req.body;
        const result = await collections.posters.insertOne(poster);
  
        if (result.acknowledged) {
            res.status(201).send(`Created a new poster: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new poster.");
        }
    } catch (error:any) {
        console.error(error);
        res.status(400).send(error.message);
    }
 });

 posterRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const poster = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.posters.updateOne(query, { $set: poster });
  
        if (result && result.matchedCount) {
            res.status(200).send(`Updated an poster: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an poster: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an poster: ID ${id}`);
        }
    } catch (error:any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });

 posterRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.posters.deleteOne(query);
  
        if (result && result.deletedCount) {
            res.status(202).send(`Removed an poster: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an poster: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an poster: ID ${id}`);
        }
    } catch (error:any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });