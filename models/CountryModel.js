const mongoose = require("mongoose");

const countrySchema = mongoose.Schema(
  {
    country_name: { type: String},
    country_code: { type: String},
    icon: { type: String}
  },
  {
    timestamps: true
  }
);

const Country = mongoose.model('Country',countrySchema);

module.exports = Country;