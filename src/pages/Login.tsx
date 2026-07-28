
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/config/ThemeToggle";
import { Eye, EyeOff } from "lucide-react";
import Axios from "@/config/axios";
import { toast } from "sonner";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    // const accounts = useAppSelector((s) => s.auth.accounts);
    const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");

    const submit = (e: React.FormEvent) => {
        toast.success(`login succes, hello!`);
        e.preventDefault();
        const acc = email.toLowerCase() === email.trim().toLowerCase() && password === password;
        if (!acc) { toast.error("Invalid email or password"); return; }
        // dispatch(setCurrentUser(acc.id));
        toast.success(`login succes, hello!`);
        // navigate("/");
    };


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Login successful");
        // try {
        //     const response = await Axios.post("/auth/login", {
        //         uname: username,
        //         pswd: password,
        //     });

        //     console.log("response", response)
        //     if (response.status === 200) {
        //         toast.success("Login successful");
        //         // You might want to store the token here if returned
        //         // localStorage.setItem("token", response.data.token); 
        //         // navigate("/");
        //     }
        // } catch (error: any) {
        //     console.error("Login failed:", error);
        //     toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
        // }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-start">
                        Sign In
                    </CardTitle>
                    <CardDescription className="text-center text-start">
                        Enter your credential. You can log in using HOTS account  
                        or using registered email address  
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">
                                HOTS Username or Registered Email
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Username"
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
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Forgot password? 
                    </p>
                    <p className="m-2 text-sm text-gray-500 ">
                         Have an invitation PIN?
                    </p>
                </CardFooter>
            </Card>
        </div>

    );
};

export default Login;
