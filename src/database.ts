import * as mongodb from "mongodb";
import { User } from "./interfaces/user";
 
export const collections: {
   users?: mongodb.Collection<User>|any;
} = {};
 
export async function connectToDatabase(uri: string) {
   const client = new mongodb.MongoClient(uri);
   await client.connect();
 
   const db = client.db("wishlearndbV1");
   await applySchemaValidation(db);
 
   const usersCollection = db.collection<User>("users");
   collections.users = usersCollection;
}
 
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
   const jsonSchema_User = {
       $jsonSchema: {
           bsonType: "object",
           required: ["fname", "lname", "dob","gender","pno","email","role"],
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
 
   // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
       collMod: "users",
       validator: jsonSchema_User
   }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("users", {validator: jsonSchema_User});
       }
   });
}