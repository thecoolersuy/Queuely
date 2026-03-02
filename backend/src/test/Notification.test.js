const SequelizeMock = require("sequelize-mock");

const dbMock = new SequelizeMock();

const NotificationMock = dbMock.define('Notification', {
    notification_id: 1,
    user_id: 1,
    title: 'New Booking',
    message: 'You have a new booking request.',
    is_read: false,
});

describe("Notification Model", () => {
    it("should create a Notification", async () => {
        const notification = await NotificationMock.create({
            user_id: 1,
            title: 'New Booking',
            message: 'You have a new booking request.',
            is_read: false,
        });

        expect(notification.title).toBe('New Booking');
        expect(notification.is_read).toBe(false);
    });
});
