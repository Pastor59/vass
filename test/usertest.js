import chai from'chai';
import chaiHttp from'chai-http';
import sinon from 'sinon';
import "@babel/polyfill";
import app from './../app.js';
import {filterById, filterByName} from '../src/middlewares/authmiddleware';
import UserController from '../src/controllers/usercontroller';

const expect = chai.expect;
chai.use(chaiHttp);

const testId = 'a0ece5db-cd14-4f21-812f-966633e7be86';
const testIdNotExists = 'a0ece5db-cd14-4f21-812f-966633e7be8';
const testIdNoPermision = 'a0ece5db-cd14-4f21-812f-966633e7be';

const testName = 'Britney';
const testNameExists = 'Shakira';
const testNameNoPermision = 'Eminem';

describe("Get User", () => {
    describe("Get user data filtered by user id", () => {
        it("should return an user", (done) =>{
            chai.request(app.modules.server)
            .get(`/user/${testId}`)       
            .end((err, res) => {
                let users = JSON.parse(res.text);
                expect(users.id).to.be.equal(testId);
                expect(res.status).to.be.equal(200);
                expect(err).to.be.null;
                done();
            })
        })
        it("should return user not found", (done) =>{
            chai.request(app.modules.server)
            .get(`/user/${testIdNotExists}`)       
            .end((err, res) => {
                expect(res.status).to.be.equal(404);
                expect(res.text).to.be.equal(`User with id ${testIdNotExists} doesn't exists`);
                expect(err).to.be.null;
                done();
            })
        })
        it("should return user have no permision", (done) =>{
            const req = {
                "params":{
                    "id": testIdNoPermision
                } 
            }
            const res = {
                status: 200,
                text: "",
                status: function(status){
                    this.status = status;
                },
                send: function(text){
                    this.text = text;
                }
            }
            sinon.stub(UserController, 'getClients')
            UserController.getClients.returns(
                [{
                    "id": testIdNoPermision,
                    "name":"Britney",
                    "email":"britneyblankenship@quotezart.com",
                    "role":"notadminusereither"
                }]
            )
            filterById(req, res, ()=>{}).then((res2) =>{
                expect(res.status).to.be.equal(403);
                expect(res.text).to.be.equal(`No permisions for user with id ${testIdNoPermision}`);
                done();
            })
            UserController.getClients.restore();
        })
    })

    describe("Get user data filtered by user name", () => {
        it("should return an user", (done) =>{
            chai.request(app.modules.server)
            .get(`/user/?name=${testName}`)       
            .end((err, res) => {
                let users = JSON.parse(res.text);
                expect(users.name).to.be.equal(testName);
                expect(res.status).to.be.equal(200);
                expect(err).to.be.null;
                done();
            })
        })
        it("should return user not found", (done) =>{
            chai.request(app.modules.server)
            .get(`/user/?name=${testNameExists}`)       
            .end((err, res) => {
                expect(res.text).to.be.equal(`User with name ${testNameExists} doesn't exists`)
                expect(res.status).to.be.equal(404);
                expect(err).to.be.null;
                done();
            })
        })
        it("should return user have no permision", (done) =>{
            const req = {
                "query":{
                    "name": testNameNoPermision
                } 
            }
            const res = {
                status: 200,
                text: "",
                status: function(status){
                    this.status = status;
                },
                send: function(text){
                    this.text = text;
                }
            }
            sinon.stub(UserController, 'getClients')
            UserController.getClients.returns(
                [{
                    "id": "4923342-454-3DS-3234",
                    "name": testNameNoPermision,
                    "email":"blankenship@quotezart.com",
                    "role":"notadminusereither"
                }]
            )
            filterByName(req, res, ()=>{}).then((res2) =>{
                expect(res.status).to.be.equal(403);
                expect(res.text).to.be.equal(`No permisions for user with name ${testNameNoPermision}`);
                done();
            })
            UserController.getClients.restore();
        })
    })    
})