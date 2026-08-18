
//React Requirement
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";


//Component
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Grid3x3, Plane, Bookmark,
    MapPin, Trash2, FileText,
    Receipt, BookOpen
} from "lucide-react";
import { deletePost } from "@/store/postsSlice";


// Redux
// import { useAppSelector, useAppDispatch } from "@/store";

// Typescript and Utils
import { } from '../types/tipes'
import { initialsOf } from '../lib/utils'


const ProfilePage = () => {

    const { userId } = useParams();
    const name = decodeURIComponent(userId);

    //ini tab di atas menu
      const [tab, setTab] = useState<"posts" | "articles" | "trips" | "saved">("posts");

}


