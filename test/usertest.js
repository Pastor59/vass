import chai from'chai';
import chaiHttp from'chai-http';
import sinon from 'sinon';
import "@babel/polyfill";
import app from './../app.js';
import {filterById, filterByName, filterByPoliceId} from '../src/middlewares/authmiddleware';
import UserController from '../src/controllers/usercontroller';
import PolicyController from '../src/controllers/policycontroller';

const expect = chai.expect;
chai.use(chaiHttp);

const testId = 'a0ece5db-cd14-4f21-812f-966633e7be86';
const testIdNotExists = 'a0ece5db-cd14-4f21-812f-966633e7be8';
const testIdNoPermission = 'a0ece5db-cd14-4f21-812f-966633e7be';

const testName = 'Britney';
const testNameExists = 'Shakira';
const testNameNoPermission = 'Eminem';

const policy = '64cceef9-3a01-49ae-a23b-3761b604800b';
const policyExists = '64cceef9-3a01-49ae-a23b-3761b604800';
const policyNoPermission = '64cceef9-3a01-49ae-a23b-3761b6048';


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
        it("should return user have no permission", (done) =>{
            const req = {
                "params":{
                    "id": testIdNoPermission
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
                    "id": testIdNoPermission,
                    "name":"Britney",
                    "email":"britneyblankenship@quotezart.com",
                    "role":"notadminusereither"
                }]
            )
            filterById(req, res, ()=>{}).then((res2) =>{
                expect(res.status).to.be.equal(403);
                expect(res.text).to.be.equal(`No permissions for user with id ${testIdNoPermission}`);
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
        it("should return user have no permission", (done) =>{
            const req = {
                "query":{
                    "name": testNameNoPermission
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
                    "name": testNameNoPermission,
                    "email":"blankenship@quotezart.com",
                    "role":"notadminusereither"
                }]
            )
            filterByName(req, res, ()=>{}).then((res2) =>{
                expect(res.status).to.be.equal(403);
                expect(res.text).to.be.equal(`No permissions for user with name ${testNameNoPermission}`);
                done();
            })
            UserController.getClients.restore();
        })
    })

    describe("Get the user linked to a policy number", () => {
        it("should return an user", (done) =>{
            chai.request(app.modules.server)
            .get(`/user/policies/${policy}`)       
            .end((err, res) => {
                let users = JSON.parse(res.text);
                expect(users.id).to.be.equal('e8fd159b-57c4-4d36-9bd7-a59ca13057bb');
                expect(users.name).to.be.equal('Manning');
                expect(res.status).to.be.equal(200);
                expect(err).to.be.null;
                done();
            })
        })
        it("should return policy not found", (done) =>{
            chai.request(app.modules.server)
            .get(`/user/policies/${policyExists}`)       
            .end((err, res) => {
                expect(res.text).to.be.equal(`Policy with id ${policyExists} not found`);
                expect(res.status).to.be.equal(404);
                expect(err).to.be.null;
                done();
            })
        })
        it("should return user have no permission", (done) =>{
            const req = {
                "params":{
                    "id": policyNoPermission
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
            sinon.stub(PolicyController, 'getPolicies')
            PolicyController.getPolicies.returns(
                [{
                    "id": policyNoPermission,
                    "amountInsured": 1825.89,
                    "email": "inesblankenship@quotezart.com",
                    "inceptionDate": "2016-06-01T03:33:32Z",
                    "installmentPayment": true,
                    "clientId": "a3b8d425-2b60-4ad7-becc-bedf2ef860bd"
                }]
            )
            filterByPoliceId(req, res, ()=>{}).then((res2) =>{
                expect(res.status).to.be.equal(403);
                expect(res.text).to.be.equal(`No permissions for user with id a3b8d425-2b60-4ad7-becc-bedf2ef860bd`);
                done();
            })
            PolicyController.getPolicies.restore();
        })
    })

})