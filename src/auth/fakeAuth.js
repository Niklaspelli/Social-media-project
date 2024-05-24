const fakeAuth = {
  isAuthenticated: null,

  signIn(callback) {
    fakeAuth.isAuthenticated = true;
    setTimeout(callback, 300);
  },

  signOut(callback) {
    fakeAuth.isAuthenticated = false;
    setTimeout(callback, 300);
  },
};

export default fakeAuth;
