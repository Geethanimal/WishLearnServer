import * as mongodb from "mongodb";
 
export interface Comnt {
   uid?: string;
   pid?: string;
   msg?: string;
   time?: string;
   date?: string;
   _id?: mongodb.ObjectId;
}