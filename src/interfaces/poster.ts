import * as mongodb from "mongodb";
 
export interface Poster {
   uid?: string;
   title?: string;
   img?: string;
   question?: string;
   cmnts_id?:string;
   _id?: mongodb.ObjectId;
}