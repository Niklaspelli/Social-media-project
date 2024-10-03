const fakeAuth = {
  isAuthenticated: false, // Set this to true when a user logs in

  signIn(callback) {
    this.isAuthenticated = true;
    setTimeout(callback, 100); // Simulate an async operation
  },

  signOut(callback) {
    this.isAuthenticated = false;
    setTimeout(callback, 100); // Simulate an async operation
  },
};

export default fakeAuth;
