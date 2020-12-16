const fs = require('fs');
const clientSideFile = './settings/client-side.json';
/**
 * GET /settings
 */
exports.getSettings = function(req, res) {
  if (fs.existsSync(clientSideFile)) {
    fs.readFile(clientSideFile, 'utf8', function(err, contents) {
      try {
        if (err) {
          res.json(err);
          return;
        }
        res.json(JSON.parse(contents));
      } catch(err) {
        res.json(err);
      }
    });
  } else {
    res.status(400).send({msg:'No settings found!'});
  }
};
