const SequelizeMock = require("sequelize-mock");


const dbMock = new SequelizeMock();

const BookingMock  = dbMock.define('Booking',{
    booking_id: 1,
    business_id: 1,
    customer_name: 'Robert Wilson',
    customer_email:'robert.wilson@gmail.com',
    service: 'Haircut',
    barber: 'Jane Smith',
    date: '2026-01-25',
    time: '10:00:00',
    amount: 25.00,
    status: 'PENDING'


});

describe("Booking Model", () => {
   it("should create a Booking",async()=>{
    const booking=await BookingMock.create({
        booking_id: 1,
        business_id: 1,
        customer_name: 'Robert Wilson',
        customer_email:'robert.wilson@gmail.com',
        service: 'Haircut',
        barber: 'Jane Smith',
        date: '2026-01-25',
        time: '10:00:00',
        amount: 25.00,
        status: 'PENDING'
    })
   })
})