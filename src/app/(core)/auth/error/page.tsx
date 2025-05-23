'use client';

import Link from 'next/link';

export default function AuthErrorPage() {

  const errorMessage = '登录失败，检查您提供的信息';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-red-600">登录错误</h1>
        <p className="text-center text-gray-700">{errorMessage}</p>
        
        <div className="flex justify-center pt-4">
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            返回登录
          </Link>
        </div>
      </div>
    </div>
  );
}