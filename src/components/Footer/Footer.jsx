import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-muted py-3 mt-auto border-top border-secondary border-opacity-25">
      <div className="container text-center text-md-between d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
        <span className="small">&copy; {new Date().getFullYear()} TeamTask Application. All rights reserved.</span>
        <div className="d-flex gap-3 small">
          <span className="text-secondary">Built By : Ahmed Ali</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
