const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        minlength: [10, 'A tour name must have less or equal than 10 character'],
        maxlength: [40, 'A tour name must have greater or equal than 40 character'],
        // validate: [validator.isAlpha, 'Tour name must only contains characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty must be either easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must above 1.0'],
        max: [5, 'Rating must above 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price
            },
            message: 'A price discount ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        discription: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: Array
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})

// Document middleware runs .save and .create method
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// })

tourSchema.pre('save', async function (next) {
    const guidePromises = this.guides.map(async id => await User.findById(id));
    this.guides = await Promise.all(guidePromises);
    next();
})

// Query middleware runs for query
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now();
    next();
})

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took millisecond ${Date.now()} - ${this.start}`)
    next();
})

// Aggregate middleware 
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    next();
})


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;