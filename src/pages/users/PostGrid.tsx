import { Trash2 } from "lucide-react";

interface Post {
  id: string;
  text: string;
  photos: { url: string }[];
}

interface PostsGridProps {
  posts: Post[];
  onDeletePost?: (postId: string) => void;
  showDeleteButton?: boolean;
}

export function PostsGrid({ 
  posts, 
  onDeletePost, 
  showDeleteButton = false 
}: PostsGridProps) {
  if (posts.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No posts yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => {
        const cover = post.photos[0]?.url;
        return (
          <div 
            key={post.id} 
            className="group relative aspect-square overflow-hidden bg-muted"
          >
            {cover ? (
              <img 
                src={cover} 
                alt={post.text.slice(0, 40)} 
                loading="lazy" 
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-2 text-center text-[11px] text-muted-foreground">
                {post.text.slice(0, 80) || "Text post"}
              </div>
            )}
            
            {showDeleteButton && onDeletePost && (
              <button
                onClick={() => onDeletePost(post.id)}
                aria-label="Delete"
                className="absolute right-1 top-1 hidden rounded-full bg-background/80 p-1.5 text-destructive group-hover:block"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}