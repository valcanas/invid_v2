const voteModel = require('../models/mongooseModels/vote').model;
const videoModel = require('../models/mongooseModels/video').model;

const create = vote => {
    return new Promise( (resolve, reject) => {
      const newvote = new voteModel(vote);
      newvote.save( err => {
        if (err) reject(err);
        resolve(newvote);
      });
    });
  }

  const findAll = () => {
    return new Promise( (resolve, reject) => {
        const callback = (err, result) => {
        if (err) reject(err);
        resolve(result);
      };
      voteModel.find({star_vote: true}).exec(callback);
    });
  }
/*
  const findByVideoID = (id_video) => {
    return new Promise((resolve, reject) =>{
      voteModel.aggregate([ { $match: {"id_video": id_video}}, {$group: {"_id": "$type", count: {$sum: 1}}}], (err, result) =>{
          if (err) reject (err);
          resolve(result);
      });
  })
}
*/
 
  const findAverageStars = id_video => {
    return new Promise((resolve, reject) => {
      const callback = (err, result) => {
        if(err) reject(err);
        resolve(result);
      };
      voteModel.findOne(id_video, 'Videos', function(err, videoModel){
        Videos.aggregate([
          {$match: {id_video: {$in: videoModel.Videos}}},
          {$group: {id_video: videoModel.id_video, title: videoModel.title, gen_id: videoModel.gen_id, average: {$avg: '$star_vote'} }}
        ])
      }).exec(callback);
    })
  }


  const findMostVoted = () => {
    return new Promise((resolve, reject) =>{
      voteModel.aggregate([ { $match: {"star_vote": { $gte: 4 }}}, {$group: {"id_video": "$id_video"}}], (err, result) =>{
          if (err) reject (err);
          resolve(result);
      });
  })

  }


  


  module.exports = {
    findMostVoted,
    findAverageStars,
    create,
    findAll
  }

