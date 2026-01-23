import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AuthForm, SignOutButton } from "./components/auth";
import { Toaster } from "sonner";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-blue-600">TaskFlow</h2>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Authenticated>
        <Dashboard />
      </Authenticated>
      
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-[600px] p-8">
          <AuthForm />
        </div>
      </Unauthenticated>
    </>
  );
}
