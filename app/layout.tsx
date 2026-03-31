import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Пик Момента',
  description: 'Игровой прототип на точность чувства эпизода.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
