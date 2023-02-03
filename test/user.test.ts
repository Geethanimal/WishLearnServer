import {beforeAll,beforeEach, describe, it} from "@jest/globals";
import request from 'supertest';
import {app} from '../src/server'
import {connectToDatabase} from "../src/database";
import { collections } from "../src/database";

describe('Users CURD (Get,Get by id, Post, Delete)', () => {
    beforeAll(async () => {
        await connectToDatabase("mongodb+srv://wishlearntest:wishlearntest123@cluster0.xr5hjkk.mongodb.net/test")
    })

    it('creates a new user', async () => {
        const res = await request(app)
        .post('/users/')
        .send({
            "fname": "Geethan",
            "lname": "Imal",
            "dob": "01/05/1998",
            "gender": "male",
            "pno": "0767125330",
            "email": "geethanimal0@gmail.com",
            "role": "student",
            "password": "password1234"
        });

        expect(res.status).toEqual(201);
    });


    it('gets All user', async () => {
        const res = await request(app)
        .get('/users/')
        .send();
        expect(res.status).toEqual(200);
    });



});


