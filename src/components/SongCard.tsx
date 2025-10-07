import { Music, Plus } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { SongAndPupular } from '@/store/slices/playlistsSlice';

interface SongCardProps {
  song: SongAndPupular;
  onAddToPlaylist?: (song: SongAndPupular) => void;
  showAddButton?: boolean;
}

const SongCard = ({ song, onAddToPlaylist, showAddButton = true }: SongCardProps) => {
  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 bg-card/60 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
            {song.thumbnail ? (
              <img 
                src={song.thumbnail} 
                alt={song.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {song.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                {song.genre? song.genre : song.album}
              </span>
            </div>
          </div>

          {showAddButton && onAddToPlaylist && (
            <Button
              variant="music"
              size="icon"
              onClick={() => onAddToPlaylist(song)}
              className="flex-shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SongCard;
