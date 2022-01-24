const jwt = require("jsonwebtoken");

//トークンが有効かどうか判定
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) res.status(403).json("トークンが有効ではありません。");
      //問題がない場合
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("あなたは認証されていません。");
  }
};

//トークンと権限状態が有効かどうかチェック。
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("許可がありません");
    }
  });
};

//トークンと認証状態が有効かどうかチェック
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("許可がありません");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
