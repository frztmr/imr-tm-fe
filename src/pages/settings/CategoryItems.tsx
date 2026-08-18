
//React Requirement
import { Link, useParams } from "react-router-dom";

//Component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Lock, RotateCcw } from "lucide-react";
import { SettingControl } from "@/components/SettingControl";
import { toast } from "sonner";

//Redux
// import { useAppDispatch, useAppSelector, type RootState } from "@/store";
// 

//Typescript, Util, Dummy datas
import {
    resolveSettings,
    sourceLabel,
    settingsCategories
} from "./";
