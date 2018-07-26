const Profile = require('../models/post');


exports.createProfile = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host"); 
    const profile = new Profile({
        imagepath: url + "/images/" + req.file.filename,
        name: req.body.name,
        website: req.body.website,
        number: req.body.number,
        workfield: req.body.workfield,
        services: req.body.services,
        year: req.body.year,
        location: req.body.location,
        creator: req.userData.userId
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
        }); // New entry automaticaly created by mongoose
}


exports.updateProfile = (req, res, next) => {
    let imagepath = req.body.imagepath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagepath = url + "/images/" + req.file.filename;
    }
    const profile = new Profile({
        _id: req.body.id,
        imagepath: imagepath,
        name: req.body.name,
        website: req.body.website,
        number: req.body.number,
        workfield: req.body.workfield,
        services: req.body.services,
        year: req.body.year,
        location: req.body.location,
        creator: req.userData.userId
    });
    Profile.updateOne({ _id: req.params.id, creator: req.userData.userId }, profile)
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

exports.getProfiles = (req, res, next) => { // FIRST middleware, only requsests targeting /api/profiles will reach this
    const profileQuery = Profile.find();
    let fetchedProfiles;
    profileQuery.find()
        .then(documents => {
            console.log(documents);
            fetchedProfiles = documents;
            return Profile.count();
        })
        .then(count => {
            res.status(200).json({
                message: 'profiles fetched successfully!',
                profiles: fetchedProfiles
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching profiles failed"
            });
        });
}

exports.getProfile = (req, res, next) => {
    Profile.findById(req.params.id)
        .then(profile => {
            if (profile) {
                res.status(200).json(profile);
            } else {
                res.status(404).json({ message: "profile not found!" });
            }
        });
}

exports.deleteProfile = (req, res, next) => {
    Profile.deleteOne({ _id: req.params.id, creator:req.userData.userId }).then(
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