import { beforeAll, beforeEach, describe, it } from "@jest/globals";
import request from 'supertest';
import { app } from '../src/server'
import { connectToDatabase } from "../src/database";

var cookie: any;

describe('Users CURD (Get,Get by id, Post, Delete)', () => {
    beforeAll(async () => {
        await connectToDatabase("mongodb+srv://wishlearntest:wishlearntest123@cluster0.xr5hjkk.mongodb.net/test")
    })

    test('POST /register should create a new user', async () => {
        try {
            const response = await request(app)
                .post('/users/register')
                .send({
                    "fname": "Geethan",
                    "lname": "Imal",
                    "dob": "01-05-2000",
                    "gender": "male",
                    "pno": "0767125330",
                    "email": "geethan2@gmail.com",
                    "role": "teacher",
                    "password": "gee"
                });

            expect(response.status).toBe(201);
        } catch (e) {
            expect(e).toBeFalsy();
        }

    });

    // it('creates a new user', async () => {
    //     try {
    //         const res = await request(app)
    //             .post('/users/register')
    //             .send({

    //                 "fname": "Geethan",
    //                 "lname": "Imal",
    //                 "dob": "01-05-2000",
    //                 "gender": "male",
    //                 "pno": "0767125330",
    //                 "email": "geethan@gmail.com",
    //                 "role": "teacher",
    //                 "password": "gee"

    //             });
    //         // cookie = res.headers;

    //         expect(res.status).toEqual(201);
    //     } catch (e) {
    //         expect(e).toBeFalsy();
    //     }



    // });


    // it('gets All user', async () => {
    //     try{
    //         const res = await request(app)
    //         .get('/users/')
    //         .send();
    //         expect(res.status).toEqual(200);
    //     }catch(e){
    //         expect(e).toBeFalsy();
    //     }
    // });

    // it('gets user by id', async () => {
    //     try{
    //         const res = await request(app)
    //         .get('/users/id:')
    //         .send({"_id":"63dd86a7f6ca77206ac663ca"});
    //         expect(res.status).toEqual(200);
    //     }catch(e){
    //         expect(e).toBeFalsy();
    //     }

    // });


});



