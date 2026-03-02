const SequelizeMock = require("sequelize-mock");

const dbMock = new SequelizeMock();

const ReviewMock = dbMock.define('Review', {
    review_id: 1,
    booking_id: 1,
    business_id: 1,
    user_id: 1,
    rating: 5,
    comment: 'Great service!',
});

describe("Review Model", () => {
    it("should create a Review", async () => {
        const review = await ReviewMock.create({
            booking_id: 1,
            business_id: 1,
            user_id: 1,
            rating: 5,
            comment: 'Great service!',
        });

        expect(review.rating).toBe(5);
        expect(review.comment).toBe('Great service!');
    });
});
