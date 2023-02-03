import * as mongodb from "mongodb";
 
export interface Employee {
   fname: string;
   lname: string;
   dob: string;
   gender: "male" | "female" ;
   pno: string;
   email: string;
   role: "student" | "teacher";
   _id?: mongodb.ObjectId;
}