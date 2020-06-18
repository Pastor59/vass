import chai from'chai';
import chaiHttp from'chai-http';
import "@babel/polyfill";
import app from './../app.js';

const expect = chai.expect;
chai.use(chaiHttp);

const username = "Britney";
const BirtneyId = "a0ece5db-cd14-4f21-812f-966633e7be86";

const usernameExists = "Shakira";
const usernamePermission = "Barnett";

describe("Get policies", () => {
    describe("Get the list of policies linked to a user name", () => {
        it(`should return policies for username`, (done) =>{
            chai.request(app.modules.server)
            .get(`/policies/user/${username}`)       
            .end((err, res) => {
                let policies = JSON.parse(res.text);
                expect(policies[0].clientId).to.be.equal(BirtneyId);
                expect(policies.length).to.be.equal(102);
                expect(res.status).to.be.equal(200);
                expect(err).to.be.null;
                done();
            })
        })
        it(`should return username not found`, (done) =>{
            chai.request(app.modules.server)
            .get(`/policies/user/${usernameExists}`)       
            .end((err, res) => {
                expect(res.text).to.be.equal(`Client with name ${usernameExists} not found`);
                expect(res.status).to.be.equal(404);
                expect(err).to.be.null;
                done();
            })
        })
        it(`should return user have no permissions`, (done) =>{
            chai.request(app.modules.server)
            .get(`/policies/user/${usernamePermission}`)       
            .end((err, res) => {
                expect(res.text).to.be.equal(`No permissions for user with name ${usernamePermission}`);
                expect(res.status).to.be.equal(403);
                expect(err).to.be.null;
                done();
            })
        })
    })
})

