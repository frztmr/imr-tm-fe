import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../config/ThemeToggle";
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";
import Axios from "../config/axios";
import { toast } from "sonner";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Availability check state
    const [checking, setChecking] = useState(true);
    const [isReady, setIsReady] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await Axios.post("/auth/login", {
                uname: username,
                pswd: password,
            });

            console.log("response", response);
            if (response.status === 200) {
                toast.success("Login successful");
                // localStorage.setItem("token", response.data.token);
                // navigate("/");
            }
        } catch (error: any) {
            console.error("Login failed:", error);
            toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loginAvailCheck = async () => {
            try {
                const response = await Axios.get("/auth/check"); 

                if (!isMounted) return;

                const { msg, ready } = response.data || {};

                if (response.status === 200 && ready === true) {
                    setIsReady(true);
                    toast.success(msg || "Ready to login");
                } else {
                    setIsReady(false);
                    toast.error(msg || "Service unavailable");
                }
            } catch (error: any) {
                console.error("Login check failed:", error);
                if (!isMounted) return;
                setIsReady(false);
                toast.error(error.response?.data?.msg || error.response?.data?.message || "Whoops!");
            } finally {
                if (isMounted) setChecking(false);
            }
        };

        loginAvailCheck();

        return () => {
            isMounted = false;
        };
    }, []);

    // Loading state
    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-sm">Checking availability...</p>
                </div>
            </div>
        );
    }

    // Maintenance state
    if (!isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative">
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1 items-center text-center">
                        <AlertTriangle className="h-10 w-10 text-yellow-500 mb-2" />
                        <CardTitle className="text-2xl font-bold">
                            Under Maintenance
                        </CardTitle>
                        <CardDescription>
                            This service is currently unavailable. Please check back later.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    // Ready state — show login form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        Sign in
                    </CardTitle>
                    <CardDescription>
                        Enter your credential.
                        <br />
                        You can log in using HOTS account or using registered email address
                        HOTS Username or Registered Email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">
                                Email
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                    <span className="sr-only">
                                        {showPassword ? "Hide password" : "Show password"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
                            Sign in
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 text-sm">
                    <div className="flex w-full justify-between text-sm text-muted-foreground">
                        <p className="hover:text-foreground cursor-pointer">
                            Have an invitation? Create account
                        </p>
                        <p className="hover:text-foreground cursor-pointer">
                            Forgot password?
                        </p>
                    </div>
                    <p className="w-full rounded-md border bg-muted/40 p-2 text-xs text-muted-foreground">
                        this test platform is on progress
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;