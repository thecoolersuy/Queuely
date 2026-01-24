const SequelizeMock = require("sequelize-mock");


const dbMock = new SequelizeMock();

const BusinessMock  = dbMock.define('Business',{
    business_id: 1,
    shopName: 'Test Shop',
    firstName: 'John',
    lastName: 'Doe',
    email:'john.doe@gmail.com',
    phoneNumber: '1234567890',
    password: 'hashedpassword',
    country:'USA',
    profileImage:'http://example.com/image.jpg'
});

describe("Business Model", () => {
   it("should create a Business",async()=>{
    const business=await BusinessMock.create({
        shopName: 'Test Shop',
        firstName: 'John',
        lastName: 'Doe',
        email:'john.doe@gmail.com',
        phoneNumber: '1234567890',
        password: 'hashedpassword',
        country :'USA',
        profileImage: 'http://example.com/image.jpg'
    })
   })
})