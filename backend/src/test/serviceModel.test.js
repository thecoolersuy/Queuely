const SequelizeMock = require("sequelize-mock");


const dbMock = new SequelizeMock();

const ServiceMock  = dbMock.define('Service',{
    service_id: 1,
    business_id: 1,
    name: 'Haircut',
    price: 25.00,
    duration: 30,
    description: 'Basic haircut service'


});

describe("Service Model", () => {
   it("should create a Service",async()=>{
    const service=await ServiceMock.create({
        service_id: 1,
        business_id: 1,
        name: 'Haircut',
        price: 25.00,
        duration: 30,
        description: 'Basic haircut service'
    })
   })
})