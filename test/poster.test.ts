import {beforeAll,beforeEach, describe, it} from "@jest/globals";
import request from 'supertest';
import {app} from '../src/server'
import {connectToDatabase} from "../src/database";

describe('Posters CURD (Get,Get by id, Post, Delete)', () => {
    beforeAll(async () => {
        await connectToDatabase("mongodb+srv://wishlearntest:wishlearntest123@cluster0.xr5hjkk.mongodb.net/test")
    })

    it('creates a new poster', async () => {
        try{
            const res = await request(app)
            .post('/posters/')
            .send({
                "uid": "string",
                "title": "My 1st Poster",
                "question": "My 1st question",
                "cmnts_id":"string",
            });
            expect(res.status).toEqual(201);
        }catch(e){
            expect(e).toBeFalsy();
        }


        
    });


    it('gets All posters', async () => {
        try{
            const res = await request(app)
            .get('/posters/')
            .send();
            expect(res.status).toEqual(200);
        }catch(e){
            expect(e).toBeFalsy();
        }
    });



});


