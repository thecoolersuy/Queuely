const SequelizeMock = require("sequelize-mock");


const dbMock = new SequelizeMock();

const UserMock  = dbMock.define('User',{
    user_id: 1,
    name: 'Alice Johnson',
    location: 'New York',
    email:'alice.johnson@gmail.com',
    password: 'hashedpassword123'


});

describe("User Model", () => {
   it("should create a User",async()=>{
    const user=await UserMock.create({
        user_id: 1,
        name: 'Alice Johnson',
        location: 'New York',
        email:'alice.johnson@gmail.com',
        password: 'hashedpassword123'
    })
   })
})