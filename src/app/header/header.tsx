import Link from 'next/link';
import './header.css';

const TransparentHeader = () => {
  return (
    <header>
      <nav>
      <button className='back'>
        <Link
          href="/">
          <img
            src="/jihasil_logo.svg"
            alt="Logo"
          />
        </Link>
      </button>

      <div>
        <button>
          <Link href="/about">
            About
          </Link>
        </button>
      </div>
      </nav>
    </header>
  );
};

export default TransparentHeader;