import Link from 'next/link';
import './header.css';

const TransparentHeader = () => {
  return (
    <header className="bg-inherit w-screen flex sticky top-0">
      <div className="flex w-full justify-between h-full p-5">
        <div>
          <button>
            <Link
              href="/">
              <img
                className="h-8"
                src="/jihasil_logo.svg"
                alt="Logo"
              />
            </Link>
          </button>
        </div>

        <div>
          <button>
            <Link href="/about">
              ABOUT
            </Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TransparentHeader;