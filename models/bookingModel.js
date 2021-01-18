const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a Tour!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a User!']
    },
    price: {
        type: Number,
        required: [true, 'Booking must have price!']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

bookingSchema.pre(/^find/, function (next) {
    this.populate('user')


    // this.populate('user')
    //     .populate({
    //         path: 'tour',
    //         select: 'name'
    //     })
    next();
})

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;