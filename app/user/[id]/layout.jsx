'use client';

import Navbar from '../../components/Navbar';

export default function UserLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
