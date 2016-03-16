//upload file
var request = require('request');
var util = require('util');

exports.uploadSingleFile = function(req, res) {
  var host = req.headers.host;
  var filename = req.file.filename;
  var tmp_url = host + '/tmp/images/' + filename;
  var base_url = 'http://image.thanksearch.com/interface/get_upload_image.php?pid=20&url=%s';

  function callback(err, result, body) {
    if (err) {
      res.json({
        code: '500',
        err: JSON.stringify(err)
      })
    } else {
      var data = JSON.parse(body);
      if (data.code === 1) {
        res.json({
          code: '200',
          url: data.default.replace('auto', 'original')
        });
      } else {
        res.json({
          code: '500',
        })
      }
    }
  }

  request(util.format(base_url, tmp_url), callback);

};
