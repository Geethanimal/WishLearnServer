import * as mongodb from "mongodb";
import { User } from "./interfaces/user";
import { Poster } from "./interfaces/poster";
import { Comnt } from "./interfaces/comnt";

export const collections: {
    users?: mongodb.Collection<User> | any;
    posters?: mongodb.Collection<Poster> | any;
    comnts?: mongodb.Collection<Comnt> | any;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("wishlearndbV1");
    await applySchemaValidation(db);

    const usersCollection = db.collection<User>("users");
    const postersCollection = db.collection<Poster>("users");
    const comntsCollection = db.collection<Comnt>("comnts");
    collections.users = usersCollection;
    collections.posters = postersCollection;
    collections.comnts = comntsCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
    // JsonSchema Validation for User
    const jsonSchema_User = {
        $jsonSchema: {
            bsonType: "object",
            required: ["fname", "lname", "dob", "gender", "pno", "email", "role"],
            additionalProperties: false,
            properties: {
                _id: {},
                fname: {
                    bsonType: "string",
                    description: "'fname' is required and is a string",
                },
                lname: {
                    bsonType: "string",
                    description: "'lname' is required and is a string",
                },
                dob: {
                    bsonType: "string",
                    description: "'dob' is required and is a string",
                },
                gender: {
                    bsonType: "string",
                    description: "'gender' is required and is a string",
                    enum: ["male", "female"],
                },
                pno: {
                    bsonType: "string",
                    description: "'phone no' is required and is a string",
                },
                email: {
                    bsonType: "string",
                    description: "'email' is required and is a string",
                },
                position: {
                    bsonType: "string",
                    description: "'position' is required and is a string",
                    minLength: 5
                },
                role: {
                    bsonType: "string",
                    description: "'level' is required and is one of 'junior', 'mid', or 'senior'",
                    enum: ["junior", "mid", "senior"],
                },
                password: {
                    bsonType: "string",
                    description: "'password' is required and is a string",
                    minLength: 6
                },
            },
        },
    };

    // JsonSchema Validation for Poster
    const jsonSchema_Poster = {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "question", "cmnts_id"],
            additionalProperties: false,
            properties: {
                _id: {},
                title: {
                    bsonType: "string",
                    description: "'title' is required and is a string",
                },
                question: {
                    bsonType: "string",
                    description: "'question' is required and is a string",
                },
                cmnts_id: {
                    bsonType: "string",
                    description: "'cmnts' is required and is a string",
                },
            },
        },
    };

    // JsonSchema Validation for Comnt
    const jsonSchema_Comnt = {
        $jsonSchema: {
            bsonType: "object",
            required: ["uid", "msg", "time","date"],
            additionalProperties: false,
            properties: {
                _id: {},
                uid: {
                    bsonType: "string",
                    description: "'title' is required and is a string",
                },
                msg: {
                    bsonType: "string",
                    description: "'msg' is required and is a string",
                },
                time: {
                    bsonType: "string",
                    description: "'time' is required and is a string",
                },
                date: {
                    bsonType: "string",
                    description: "'date' is required and is a string",
                },
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it
    await db.command({
        collMod: "users",
        validator: jsonSchema_User
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("users", { validator: jsonSchema_User });
        }
    });

    await db.command({
        collMod: "posters",
        validator: jsonSchema_Poster
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("posters", { validator: jsonSchema_Poster });
        }
    });

    await db.command({
        collMod: "comnts",
        validator: jsonSchema_Comnt
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("comnts", { validator: jsonSchema_Comnt });
        }
    });
}