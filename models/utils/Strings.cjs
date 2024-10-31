const StringReq = {
  type: String,
  required: true,
  validate: /^[a-zA-Z0-9áéíóúüñÑ!@#\$%\^\&*\)\(+=._-]+$/,
};

const StringReqUnique = {
  type: String,
  required: true,
  validate: /^[a-zA-Z0-9áéíóúüñÑ!@#\$%\^\&*\)\(+=._-]+$/,
  unique: true,
};

const StringUrls = {
  type: String,
  required: true
}

module.exports.StringReq = StringReq;
module.exports.StringReqUnique = StringReqUnique;
module.exports.StringUrls = StringUrls
