const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.startTime && value > this.startTime;
        },
        message: "End time must be after start time",
      },
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

availabilitySchema.index({ provider: 1, startTime: 1 });

module.exports = mongoose.model("Availability", availabilitySchema);