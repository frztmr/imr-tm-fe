import Dashboard from './Dashboard';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Sparkles, TrendingUp, FileText, PenSquare, Trash2 } from "lucide-react";

import { useMemo, useState } from "react";
import NavBar from '../components/navBar'

const photos = [];


const FeedCard = () => {
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/30">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {/* {initialsOf(trip.assignee)} */}AB
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-semibold">
              {/* {trip.assignee} */}AA
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {/* <MapPin className="h-3 w-3" /> {citiesLabel}, {trip.country} · {trip.startDate} */} Map Pin
            </div>
          </div>
        </div>
        <span className="text-2xl leading-none" aria-hidden>
          {/* {flagOf(trip.country)} */}
          country_flag
        </span>
      </div>

      {/* Photos */}
      {photos.length > 0 && (
        <div className={
          photos.length
            === 1 ?
            "" : "grid grid-cols-2 gap-0.5"}>
          {photos.slice(0, 4).map((src, i) => (
            <img
              key={i}
              src={src}
              // alt={`${citiesLabel} field photo ${i + 1}`}
              alt={"photos"}
              loading="lazy"
              className={
                photos.length === 1
                  ? "h-72 w-full object-cover sm:h-96"
                  : "aspect-square w-full object-cover"
              }
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-2 py-2">
        <button
          // onClick={() => setLiked((v) => !v)}
          className="rounded-full p-2 transition hover:bg-muted"
          aria-label="Like"
        >
          {/* <Heart className={`h-5 w-5 ${liked ? "fill-destructive text-destructive" : ""}`} /> */}
          <Heart className={`h-5 w-5 fill-destructive text-destructive`} />
        </button>
        <button className="rounded-full p-2 transition hover:bg-muted" aria-label="Comment">
          <MessageCircle className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 transition hover:bg-muted" aria-label="Share">
          <Share2 className="h-5 w-5" />
        </button>
        <div className="flex-1" />
        <button
          // onClick={() => setSaved((v) => !v)}
          className="rounded-full p-2 transition hover:bg-muted"
          aria-label="Save"
        >
          {/* <Bookmark className={`h-5 w-5 ${saved ? "fill-primary text-primary" : ""}`} /> */}
          <Bookmark className={`h-5 w-5  fill-primary text-primary  `} />
        </button>
      </div>

      {/* Body */}
      <CardContent className="space-y-2 pt-0">
        {/* <div className="text-sm font-semibold">{likes.toLocaleString()} likes</div> */}
        <div className="text-sm font-semibold">456 likes</div>
        <article className="space-y-2 text-sm leading-relaxed">
          {/* <h2 className="text-base font-semibold">{trip.title}</h2> */}
          <h2 className="text-base font-semibold">trip_title</h2>
          {/* {text.split("\n\n").map((p, i) => (
            <p key={i} className="text-foreground/90">
              <span className="font-medium text-foreground">{i === 0 ? `${trip.assignee} ` : ""}</span>
              {p}
            </p>
          ))} */}

          <p className="text-foreground/90">
            <span className="font-medium text-foreground">
              {/* {i === 0 ? `${trip.assignee} ` : ""} */}
              trip.assignee
            </span>
          </p>

        </article>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {/* {tags.map((t) => (
            <Badge key={t} variant="secondary" className="rounded-full font-normal">
              {t}
            </Badge>
          ))} */}
          <Badge variant="secondary" className="rounded-full font-normal">
            badge
          </Badge>
        </div>
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          {/* <span>View all {comments} comments</span> */}
          <span>View all  comments</span>
          {/* <Link
            to="/trips/$tripId"
            params={{ tripId: trip.id }}
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            <FileText className="h-3.5 w-3.5" /> Open full report
          </Link> */}
        </div>
      </CardContent>
    </Card>
  )
}

const Index = () => {
  // return <Dashoard />;
  return <NavBar />;
};

export default Index;
