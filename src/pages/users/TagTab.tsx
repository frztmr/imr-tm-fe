// TagTab.tsx
import { Link } from "react-router-dom";
import { Tag as TagIcon, FileText, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"; // adjust import based on your setup
import { Badge } from "@/components/ui/badge"; // adjust import based on your setup

interface Post {
  id: string;
  tripId: string;
  title?: string;
  tags?: string[];
}

interface TagTabProps {
  posts: Post[];
  userName: string; // kept for parity with ArticlesTab (optional usage)
}

export function TagTab({ posts }: TagTabProps) {
  // Aggregate posts by tag
  const tagMap = new Map<string, Post[]>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const list = tagMap.get(tag) ?? [];
      list.push(post);
      tagMap.set(tag, list);
    }
  }

  const tags = Array.from(tagMap.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  if (tags.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No tags yet.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {/* Tags Section */}
      <div className="space-y-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <TagIcon className="h-4 w-4 text-primary" /> Tags
        </h2>
        {tags.map(([tag, tagPosts]) => {
          const count = tagPosts.length;
          return (
            <Link key={tag} to={`/tags/${encodeURIComponent(tag)}`}>
              <Card className="transition hover:bg-accent">
                <CardContent className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 truncate text-sm font-medium">
                      <Hash className="h-4 w-4 text-primary" />
                      {tag}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {count} post{count === 1 ? "" : "s"}
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    Tag
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Posts Section (all tagged posts, grouped view) */}
      <div className="space-y-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4 text-primary" /> Tagged Posts
        </h2>
        {tags.map(([tag, tagPosts]) => (
          <div key={tag} className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              #{tag}
            </div>
            {tagPosts.map((post) => (
              <Link key={`${tag}-${post.id}`} to={`/posts/${post.id}`}>
                <Card className="transition hover:bg-accent">
                  <CardContent className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {post.title ?? `Post ${post.id}`}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        Trip: {post.tripId}
                      </div>
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      Post
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}