const Property = require("../models/property");
const { post } = require("../routes/adminRoutes");

exports.addProperty = async (req, res) => {
  try {
    const { id } = req.params.id;
    const {
      street,
      city,
      country,
      pinCode,
      price,
      propertyType,
      listingType,
      views,
      rooms,
      bathRooms,
      HalfBathRooms,
      squareFoot,
      yearBuilt,
      Description,
    } = req.body;
    const property = new Property({
      street,
      city,
      country,
      pinCode,
      price,
      propertyType,
      listingType,
      views,
      rooms,
      bathRooms,
      HalfBathRooms,
      squareFoot,
      yearBuilt,
      Description,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(req.body.longitude),
          parseFloat(req.body.latitude),
        ],
      },
    });
    await property.save();
    res.send(property);
  } catch (err) {
    console.log(err);
  }
};
