import { Button } from "@/components/ui/button"
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router";

function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <Button asChild>
        <Link to="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link to="/register">Sign Up</Link>
      </Button>
      <Button asChild className="focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80">
        <a href="/auth/github"><GitHubLogoIcon /> Log In with Github</a>
      </Button>
    </>
  );
}

export default HomePage;
