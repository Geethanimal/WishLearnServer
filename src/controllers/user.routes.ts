import * as dotenv from "dotenv";
import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "../database";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authenticate } from "../middleware/authentication";


export const userRouter = express.Router();
userRouter.use(express.json());

const secret :any = process.env.TOKEN_KEY;
dotenv.config();

// Register a User
userRouter.post("/register", async (req, res) => {
    try {
        const user = req.body;
        const hash = await bcrypt.hash(user.password, 6);
        user.password = hash;

        const result = await collections.users.insertOne(user);

        if (result.acknowledged) {
            const token = jwt.sign({ uid: user._id, fname: user.fname, lname: user.lname, role: user.role, email: user.email },secret , { expiresIn: '1h' });
            res.cookie('auth', token);
            res.status(201).send(`Created a new user: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error: any) {

        res.status(400).send(error.message);
    }
});

// Login
userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await collections.users.findOne({ email });

        if (!user) {
            return res.status(400).send("Incorrect email.");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send("Incorrect password.");
        }

        const token = jwt.sign({ uid: user._id, fname: user.fname, lname: user.lname, role: user.role, email: user.email }, secret, { expiresIn: '1h' });
        res.cookie('auth', token);
        res.status(200).send(`Logged in as ${user.fname +" "+ user.lname}.`);
    } catch (error:any) {
        res.status(500).send(error.message);
    }
});

// Use the authenticate middleware
userRouter.use(authenticate);

// Get All Users
userRouter.get("/", async (_req, res) => {

    try {
        const users = await collections.users.find({}).toArray();
        res.status(200).send(users);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// Get User by Id
userRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const user = await collections.users.findOne(query);

        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send(`Failed to find an user: ID ${id}`);
        }

    } catch (error) {
        res.status(404).send(`Failed to find an user: ID ${req?.params?.id}`);
    }
});

// Update users
userRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const user = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.users.updateOne(query, { $set: user });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an user: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an user: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an user: ID ${id}`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

// Delete Users
userRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.users.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an user: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an user: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an user: ID ${id}`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});