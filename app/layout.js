import './globals.css';

export const metadata = {
  title: 'Kiocreates Typography Studio',
  description: 'Create branded Kiocreates quote graphics and export them as JPG or WebP.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
