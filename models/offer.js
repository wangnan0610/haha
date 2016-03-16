var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var OfferSchema = new Schema({
  link: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  nation: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  network: {
    type: String,
    required: true
  },
  //付费方式
  type: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  //desktop and mobile
  offerType: {
    type: String,
    required: true,
    default: 'desktop'
  },
  isEffect: {
    type: Boolean,
    default: true
  },
  addtime: {
    type: Date,
    default: new Date()
  },
  adduser: {
    type: String
  },
  updatetime: {
    type: Date,
    default: new Date()
  },
  updateuser: {
    type: String
  }
});

OfferSchema.pre('update', function() {
  this.update({}, {
    $set: {
      updatetime: new Date()
    }
  });
});

mongoose.model('Offer', OfferSchema);
