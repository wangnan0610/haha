var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuditSchema = new Schema({
  //offer and user 都记录_id
  offer: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  admin: String,
  //status: wait, pass, fail
  status: {
    type: String,
    default: 'wait'
  },
  applyAt: {
    type: Date,
    default: new Date()
  },
  auditAt: Date
});

AuditSchema.pre('update', function() {
  this.update({}, {
    $set: {
      auditAt: new Date()
    }
  })
});

AuditSchema.index({
  offer: 1,
  user: 1
}, {
  unique: true
})

mongoose.model('Audit', AuditSchema);
