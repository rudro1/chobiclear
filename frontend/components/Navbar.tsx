export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Logo */}
        <a href="/" className="navbar-logo" id="navbar-logo" aria-label="ChobiClear home">
          <span>Chobi</span>Clear
        </a>

        {/* Nav links */}
        <ul className="navbar-links">
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>

        {/* CTA */}
        <a
          href="#upload"
          id="navbar-cta"
          className="btn btn-primary btn-sm"
          style={{ display: "flex" }}
        >
          Try Free ✨
        </a>
      </div>
    </nav>
  );
}
