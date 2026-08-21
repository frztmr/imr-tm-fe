//React Requirement
import { Link } from "react-router-dom";
import { useMemo } from "react";

//Component
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

//Typescript, dummy data
import { mockFeedPosts } from "@/data/mockData";

function slug(name: string) { return encodeURIComponent(name); }

interface PostsSectionProps {
  query?: string;
  // You can pass these as props or use Redux directly
  posts?: typeof mockFeedPosts;
}

export default function PostsSection({ 
  query = "", 
  posts = mockFeedPosts 
}: PostsSectionProps) {
  //   const posts = useAppSelector((s) => s.posts.posts);

  const postHits = useMemo(
    () => posts.filter((p) =>
      !query ||
      p.text.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    ),
    [posts, query],
  );

  return (
    /* TripsPosts*/
    <section>
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <FileText className="h-4 w-4" /> Posts ({postHits.length})
      </h2>
      <div className="space-y-2">
        {postHits.slice(0, 8).map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-start gap-3 p-3">
              {p.photos[0] && (
                <img src={p.photos[0].url} alt="" className="h-14 w-14 rounded object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <Link
                  to={`/u/${slug(p.author)}`}
                  className="text-sm font-medium hover:underline">
                  {p.author}
                </Link>
                <div className="line-clamp-2 text-sm text-foreground/80">{p.text}</div>
                {p.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="text-[11px] text-primary">#{t.replace(/^#/, "")}</span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {postHits.length === 0 && <p className="text-sm text-muted-foreground">No posts match.</p>}
      </div>
    </section>
  );
}