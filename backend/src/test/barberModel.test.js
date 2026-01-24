const SequelizeMock = require("sequelize-mock");


const dbMock = new SequelizeMock();

const BarberMock  = dbMock.define('Barber',{
    barber_id: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    email:'jane.smith@gmail.com',
    phoneNumber: '09834343434',
    specialization: 'Haircut',
    experience:5,
    status: 'ACTIVE'


});

describe("Barber Model", () => {
   it("should create a Barber",async()=>{
    const barber=await BarberMock.create({
        barber_id: 1,
        firstName: 'Jane',
        lastName: 'Smith',
        email:'jane.smith@gmail.com',
        phoneNumber: '09834343434',
        specialization: 'Haircut',
        experience:5,
        status: 'ACTIVE'
    })
   })
})