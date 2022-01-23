const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) res.status(403).json("トークンが有効ではありません。");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("あなたは認証されていません。");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("許可がありません");
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorization };
