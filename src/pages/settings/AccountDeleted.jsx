export default function AccountDeleted() {
  return (
    <section
      className="text-center text-white fs-4 font-bold"
      style={{ padding: "80px" }}
    >
      <h2>Your account has been successfully deleted.</h2>
      <p>We’re sorry to see you go.</p>

      <p className="mt-4">
        <a href="/" className="text-white underline">
          Go to Login
        </a>
      </p>
    </section>
  );
}
