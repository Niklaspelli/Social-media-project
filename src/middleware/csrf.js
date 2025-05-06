export const verifyCsrfToken = (req, res, next) => {
  const csrfHeader = req.headers["csrf-token"];
  const csrfCookie = req.cookies.csrfToken;

  if (!csrfHeader || csrfHeader !== csrfCookie) {
    return res.status(403).json({ error: "Invalid or missing CSRF token" });
  }

  next();
};
