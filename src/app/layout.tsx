import '@/styles/globals.css';

export const metadata = {
  title: '1Click Ink Deployer',
  description: 'Deploy ink! smart contracts in one click.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#e6007a] text-white">{children}</body>
    </html>
  );
}
