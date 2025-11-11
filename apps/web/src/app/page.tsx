import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[450px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Welcome to Project Flow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This is the home page. Use the links below to navigate to the authentication screens.
          </p>
          
          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              {/* Using asChild props allows shadcn Button to act as a Link */}
              <Link href="/login">Go to Login</Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/register">Go to Register</Link>
            </Button>

            {/* This button will eventually link to a protected route */}
            <Button asChild variant="ghost" className="w-full">
              <Link href="/board/test-project-1">View Test Board (Dynamic Route)</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
