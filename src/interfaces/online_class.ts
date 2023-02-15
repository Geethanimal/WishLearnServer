import * as mongodb from "mongodb";
 
export interface OnlineClass {
   tid?:string;
   title?:string;
   day?:string;
   time?:string;
   studets?:[] | string;
   _id?: mongodb.ObjectId;
}