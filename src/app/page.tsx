import Link from 'next/link'

export default function Home() {
  return (
    <div className = "flex gap-4">
      <Link href = '/register' className = "userline  text-blue-600 hover:text-blue-800"> Click here to signup</Link>
      <Link href = '/login' className = "userline  text-blue-600 hover:text-blue-800">Click here to Login</Link>
    </div>
  );
}
