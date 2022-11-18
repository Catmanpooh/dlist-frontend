export function SignOutButton({ accountId, onClick }) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      Sign out {accountId}
    </button>
  );
}

export function SignInButton({ onClick }) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      Sign in
    </button>
  );
}
