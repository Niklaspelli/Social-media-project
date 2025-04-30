export const verifyCsrfToken = (req, res, next) => {
  const csrfHeader = req.headers["csrf-token"];
  const csrfCookie = req.cookies.csrfToken;

  console.log("CSRF Header:", csrfHeader);
  console.log("CSRF Cookie:", csrfCookie);

  if (!csrfHeader || csrfHeader !== csrfCookie) {
    return res.status(403).json({ error: "Invalid or missing CSRF token" });
  }

  next();
};
