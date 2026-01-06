import './globals.css'

export const metadata = {
  title: 'Santi Management',
  description: 'Task and Building Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
