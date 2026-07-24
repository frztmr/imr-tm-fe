
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
        <div className="min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-md">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="h-5 w-1 text-primary" /> Sign in </CardTitle>
                <CardDescription>
                    Use your IMI field account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email or HOTS</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <Button onClick={handleLogin} type="submit" className="w-full">Sign in</Button>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <p onClick={() => navigate("/signup")} className="hover:text-foreground">Have an invitation? create an account here</p>
                        {/* <p onClick={() => navigate("/admin")} className="hover:text-foreground">Admin</p> */}
                    </div>
                    {/* <p className="rounded-md border bg-muted/40 p-2 text-xs text-muted-foreground">
                        Dev seeds — admin: <code>admin@imrc.example</code> / <code>admin123</code>; user: <code>andre.wijaya@imrc.example</code> / <code>user1234</code>
                    </p> */}
                </form>
            </CardContent>
        </Card>
    </div>
</div>

    );
};

export default Login;
