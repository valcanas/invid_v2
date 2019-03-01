const videoModel = require('../models/mongooseModels/video').model;

const create = video => {
    return new Promise( (resolve, reject) => {
      const newVideo = new videoModel(video);
      newVideo.save( err => {
        if (err) reject(err);
        resolve(newVideo);
      });
    });
  }



  const actualizar = userID => {
    return new Promise( (resolve, reject) => {
        const callback = (err, result) => {
        if (err) reject(err);
        resolve(result);
      };
      videoModel.updateOne({},{$set:{user_id: userID }}).exec(callback);
    });
  }


const findByUsername = usrname => {
  return new Promise( (resolve, reject) => {
    const callback = (err, result) => {
      if (err) reject(err);
      resolve(result);
    };
    videoModel.findOne( { username: usrname }).exec(callback);
  });
}
const findAll = () => {
  return new Promise( (resolve, reject) => {
      const callback = (err, result) => {
      if (err) reject(err);
      resolve(result);
    };
    videoModel.find({star_vote: true}).exec(callback);
  });
}



const group_by_meta = (meta) => {
  return new Promise( (resolve, reject) => {
      const callback = (err, result) => {
      if (err) reject(err);
      resolve(result);
    };
    videoModel.aggregate([{
      "$group": {
        "_id": '$meta.'+meta,
        "count": {$sum: 1}
      }
    }], callback);
  });
}



module.exports = {
  actualizar,
  findByUsername,
  findAll,
  create,
  group_by_meta,
}