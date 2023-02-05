import {beforeAll,beforeEach, describe, it} from "@jest/globals";
import request from 'supertest';
import {app} from '../src/server'
import {connectToDatabase} from "../src/database";

describe('Posters CURD (Get,Get by id, Post, Delete)', () => {
    beforeAll(async () => {
        await connectToDatabase("mongodb+srv://wishlearntest:wishlearntest123@cluster0.xr5hjkk.mongodb.net/test")
    })

    it('creates a new comment', async () => {
        try{
            const res = await request(app)
            .post('/comnts/')
            .send({
                "uid": "12345",
                "msg": "my comment",
                "time": "09.06 AM",
                "date": "01-02-2023",
            });
            expect(res.status).toEqual(201);
        }catch(e){
            expect(e).toBeFalsy();
        }


        
    });


    it('gets All comnts', async () => {
        try{
            const res = await request(app)
            .get('/comnts/')
            .send();
            expect(res.status).toEqual(200);
        }catch(e){
            expect(e).toBeFalsy();
        }
    });



});


