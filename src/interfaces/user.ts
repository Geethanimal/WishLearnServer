import * as mongodb from "mongodb";
 
export interface User {
   fname?: string;
   lname?: string;
   dob?: string;
   gender?: "male" | "female" ;
   pno?: string;
   email?: string;
   role?: "student" | "teacher";
   password?: string;
   _id?: mongodb.ObjectId;
}