
import { Link } from "react-router-dom";

interface TripPhotoTile {
  url: string;
  caption: string;
  tripId: string; // Assuming each tile has a tripId to link to
}

interface SavedTabProps {
  tripPhotoTiles: TripPhotoTile[];
  onTileClick?: (tile: TripPhotoTile) => void; // optional for custom click handling
  getTripLink?: (tile: TripPhotoTile) => string; // optional for custom link generation
  columns?: 2 | 3 | 4; // grid columns configuration
}

export function SavedTab({ 
  tripPhotoTiles, 
  onTileClick,
  getTripLink,
  columns = 3
}: SavedTabProps) {
  if (tripPhotoTiles.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No tagged shots yet.
      </p>
    );
  }

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${gridCols} gap-1`}>
      {tripPhotoTiles.map((tile) => {
        const content = (
          <div className="relative aspect-square overflow-hidden bg-muted group">
            <img 
              src={tile.url} 
              alt={tile.caption || "Tagged photo"} 
              loading="lazy" 
              className="h-full w-full object-cover transition group-hover:scale-105" 
            />
          </div>
        );

        // If custom click handler is provided
        if (onTileClick) {
          return (
            <button
              key={tile.url} // or use a unique id if available
              onClick={() => onTileClick(tile)}
              className="relative aspect-square overflow-hidden bg-muted group"
            >
              <img 
                src={tile.url} 
                alt={tile.caption || "Tagged photo"} 
                loading="lazy" 
                className="h-full w-full object-cover transition group-hover:scale-105" 
              />
            </button>
          );
        }

        // If custom link generator is provided
        if (getTripLink) {
          return (
            <Link
              key={tile.url}
              to={getTripLink(tile)}
              className="relative aspect-square overflow-hidden bg-muted group"
            >
              <img 
                src={tile.url} 
                alt={tile.caption || "Tagged photo"} 
                loading="lazy" 
                className="h-full w-full object-cover transition group-hover:scale-105" 
              />
            </Link>
          );
        }

        // Default: link to trip using tile.tripId
        return (
          <Link
            key={tile.url}
            to={`/trips/${tile.tripId}`}
            className="relative aspect-square overflow-hidden bg-muted group"
          >
            <img 
              src={tile.url} 
              alt={tile.caption || "Tagged photo"} 
              loading="lazy" 
              className="h-full w-full object-cover transition group-hover:scale-105" 
            />
          </Link>
        );
      })}
    </div>
  );
}