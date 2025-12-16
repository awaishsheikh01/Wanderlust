// for geocoding
const fetch = require('node-fetch');

const Listing = require('../models/listing');

//Index of all listings
module.exports.index = async (req, res) => {
  const { q } = req.query;

  let listings;

  if (q) {
    listings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { country: { $regex: q, $options: 'i' } },
      ],
    });
  } else {
    listings = await Listing.find({});
  }

  res.render('listings/index', { listings, q });
};

//New listing
module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs');
};

//Show
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    }) // for review
    .populate('owner'); // for owner name
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist!');
    res.redirect('/listings');
  }
  // console.log(listing);
  res.render('listings/show.ejs', { listing });
};

// Create Listing
module.exports.createListing = async (req, res, next) => {
  const { location, country } = req.body.listing;

  const geoResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${location},${country}`
  );
  const geoData = await geoResponse.json();

  if (!geoData || geoData.length === 0) {
    req.flash(
      'error',
      'Invalid location. Please enter a valid city & country.'
    );
    return res.redirect('/listings/new');
  }

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = {
    type: 'Point',
    coordinates: [
      parseFloat(geoData[0].lon), // longitude
      parseFloat(geoData[0].lat), // latitude
    ],
  };

  await newListing.save();
  req.flash('success', 'New Listing Created!');
  res.redirect('/listings');
};

//Edit
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  id = id.trim(); //  remove any accidental spaces
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist!');
    return res.redirect('/listings'); //  redirect and stop further execution
  }
  let originalImageUrl = listing.image.url;
  let resizedImageUrl = originalImageUrl.replace(
    '/upload',
    '/upload/h_300,w_250'
  );

  res.render('listings/edit.ejs', { listing, resizedImageUrl });
};

//Update
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  // update image ONLY if new image uploaded
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };

    await listing.save();
  }

  req.flash('success', 'Listing Updated!');
  res.redirect(`/listings/${id}`);
};

//Delete
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash('success', 'Listing Deleted!');
  res.redirect('/listings');
};
