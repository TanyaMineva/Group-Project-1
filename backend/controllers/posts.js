const Profile = require('../models/post');

exports.createProfile = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const profile = new Profile({
    name: req.body.name,
    location: req.body.location,
    logo: url + "/images/" + req.file.filename,
    services: req.body.services,
    workfield: req.body.workfield,
    year: req.body.year,
    website: req.body.website,
    number: req.body.number
  });
  profile.save().then(createdProfile => {
    res.status(201).json({
      message: 'profile added successfully',
      profile: {
        ...createdProfile,
        id: createdProfile._id
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a profile failed!"
    })
  });            // New entry automaticaly created by mongoose
}


exports.updateProfile = (req, res, next) => {
  let logo = req.body.logo;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    logo = url + "/images/" + req.file.filename
  }
  const profile = new Profile({
    _id: req.body.id,
    name: req.body.name,
    location: req.body.location,
    logo: logo,
    services: req.body.services,
    workfield: req.body.workfield,
    year: req.body.year,
    website: req.body.website,
    number: req.body.number
  });
  profile.updateOne({_id: req.params.id}, profile)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successfull!" })
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update profile!"
      });
    });
}

exports.getProfiles = (req, res, next) => {         // FIRST middleware, only requsests targeting /api/profiles will reach this
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const profileQuery = Profile.find();
  let fetchedProfiles;
   if (pageSize && currentPage) {
     profileQuery
       .skip(pageSize * (currentPage - 1))
       .limit(pageSize);
   }
  profileQuery.find()
    .then(documents => {
      fetchedProfiles = documents; 
      return Profile.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'profiles fetched successfully!',
        profiles: fetchedProfiles,
        maxProfiles: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching profiles failed"
      });
    });
}

exports.getProfile = (req, res, next) => {
  profile.findById(req.params.id)
    .then(profile => {
      if (profile) {
        res.status(200).json(profile);
      } else {
        res.status(404).json({message: "profile not found!"});
      }
    });
}

exports.deleteProfile = (req, res, next) => {
  profile.deleteOne({ _id: req.params.id}).then(
    result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successfull!" })
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
      .catch(error => {
        res.status(500).json({
          message: "Fetching profiles failed"
        });
      });
}
