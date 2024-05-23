const jwt = require("jsonwebtoken");

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }

  next();
};

const userExtractor = (request, response, next) => {
  const token = request.token;
  if (!token) {
    return response.status(401).json({ error: "token missing" });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    return response.status(401).json({ error: "token invalid" });
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  request.user = decodedToken; // {username, id}
  next();
};

module.exports = { tokenExtractor, userExtractor };
