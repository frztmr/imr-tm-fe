
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
// import { deletePost } from "@/store/postsSlice";
import { ProfileTabs, PostsGrid, ArticlesTab, TripsTab, SavedTab } from "./users";


// Redux
// import { useAppSelector, useAppDispatch } from "@/store";

// Typescript and Utils
import { } from '../types/tipes'
import { } from '../store/types'
import { initialsOf } from '../lib/utils'
import { dummyTrip, dummyAccount, dummyFeedPost } from '../store/dummyData'


const ProfilePage = () => {


    //ini passing data dari URL
    const { userId } = useParams();
    const name = decodeURIComponent(userId);

    console.log("userId", userId);
    console.log("name", name);

    //ini tab di atas gambar
    const [tab, setTab] = useState<"posts" | "articles" | "trips" | "saved">("posts");

    // const posts = useAppSelector((s) => s.posts.posts).filter((p) => p.author === name);
    // const trips = useAppSelector((s) => s.trips.trips).filter((t) => t.assignee === name);
    // const account = useAppSelector((s) => s.auth.accounts).find((a) => a.name === name);
    const posts = [dummyFeedPost]
    const trips = [dummyTrip]
    const account = dummyAccount

    const tripPhotoTiles = useMemo(() => {
        const tiles: { id: string; url: string; tripId: string; caption: string }[] = [];
        trips.forEach((t) => {
            t.retailAudits.forEach((r) =>
                r.photos.forEach((p) =>
                    tiles.push({ id: p.id, url: p.url, tripId: t.id, caption: p.caption }),
                ),
            );
        });
        return tiles;
    }, [trips]);

    const totalLikes = posts.length * 24 + trips.length * 80;
    const handle = name.toLowerCase().replace(/\s+/g, "");


    return (
        <>
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <header className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/20 sm:h-28 sm:w-28">
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                            {initialsOf(name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
                            <h1 className="text-xl font-semibold">{name}</h1>
                            <span className="text-sm text-muted-foreground">@{handle}</span>
                            {account?.role === "admin" && (
                                <Badge variant="secondary" className="rounded-full">Admin</Badge>
                            )}
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-6 text-sm sm:justify-start">
                            <div><span className="font-semibold">{posts.length + tripPhotoTiles.length}</span> <span className="text-muted-foreground">posts</span></div>
                            <div><span className="font-semibold">{trips.length}</span> <span className="text-muted-foreground">trips</span></div>
                            <div><span className="font-semibold">{totalLikes}</span> <span className="text-muted-foreground">likes</span></div>
                        </div>
                        <p className="mt-3 text-sm text-foreground/80">
                            {account?.role === "admin" ? "Admin" : "Field Researcher"} at IMI · capturing market truth on the ground.
                        </p>
                    </div>
                </header>

                {/* Tabs */}
                <ProfileTabs
                    activeTab={tab}
                    onTabChange={setTab}
                    className={''} />

                {/* Grid */}
                {tab === "posts" && (
                    <PostsGrid
                        posts={posts}
                        // onDeletePost={(postId) => dispatch(deletePost(postId))}
                        showDeleteButton={true}
                    />
                )}

                {/* ArticleTab */}
                {tab === "articles" && (
                    <ArticlesTab
                        trips={trips}
                        posts={posts}
                        userName={name}
                    />
                )}


                {tab === "trips" && (
                    <TripsTab trips={trips} showStatus={false} />
                )}

                {tab === "saved" && (
                    <SavedTab tripPhotoTiles={tripPhotoTiles} />
                )}
            </div>
        </>
    );
}
export default ProfilePage;

