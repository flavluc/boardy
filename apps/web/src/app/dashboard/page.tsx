import Link from 'next/link';

async function getUserData() {
  // Simulating a network delay
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return {
    name: "Alex Johnson",
    email: "alex@example.com",
    projectsCount: 5
  };
}

export default async function DashboardOverviewPage() {
  const userData = await getUserData();

  return (
    <div>
      <h1>Welcome back, {userData.name}!</h1>
      <p>Email: {userData.email}</p>
      <p>You have {userData.projectsCount} active projects.</p>
      <Link href="/dashboard/projects">View all projects</Link>
    </div>
  );
}
