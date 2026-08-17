const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: "End date must be after start date."
        }
    },

    budget: {
        type: Number,
        required: true,
        min: [1, "Budget must be greater than 0"]
    },

    category: {
        type: String,
        required: true,
        enum: [
            "Residential",
            "Commercial",
            "Industrial",
            "Infrastructure",
            "Government Projects"
        ]
    },

    status: {
        type: String,
        default: "Planning"
    },

    siteAddress: {
        type: String,
        default: "123 Construction Site Way"
    },

    latitude: {
        type: Number,
        default: 37.7749
    },

    longitude: {
        type: Number,
        default: -122.4194
    }

},
{
    timestamps: true
}
);

module.exports = mongoose.model("Project", projectSchema);