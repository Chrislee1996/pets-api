//Pet has many toys & has owner that is user

const mongoose = require('mongoose')

const {Schema, model} = mongoose

const petSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
        age: {
            type:Number,
            required:true,
        },
        adoptable: {
            type:Boolean,
            required:true,
        },
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
        // we're going to add virtuals to our model 
        //these lines ensure that the virtual will be included
        //whenever we turn our document to an object or JSON
        toObject:{virtuals:true},
        toJSON:{virtuals:true}
	}
)

//virtuals go here (we'll build these later)
//a virtual is a virtual property, that uses the data that's saved in the database
//to add a property whenever we retrieve that document and convert to an object
petSchema.virtual('fullTitle').get(function () {
    //we can do whatever javascripty we want in here
    //we just need to make sure we return some value
    //full title is going to combine the name and type to build a title
    return `${this.name} the ${this.type}`
})

petSchema.virtual('isABaby').get(function() {
    if(this.age<5) {
        return 'Yeah, just a baby'
    } else if (this.age >= 5 && this.age < 10) {
        return 'Not really a baby but still a baby'
    } else {
        return 'Good grown pet'
    }
})

module.exports = model('Pet', petSchema)
