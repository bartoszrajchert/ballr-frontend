import React from 'react';

function Footer() {
  return (
    <footer className="bg-grey-100">
      <div className="flex justify-between">
        <div>
          <p>Dla Ciebie</p>
        </div>
        <div>
          <p>Kontakt</p>
        </div>
      </div>
      <hr />
      <div className="flex justify-between">
        <div>Logo</div>
        <p>© 2023 BALLR, All rights reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
