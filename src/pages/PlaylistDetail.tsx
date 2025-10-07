import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Music, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import SongCard from '@/components/SongCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { removeSongFromPlaylist } from '@/store/slices/playlistsSlice';
import { RootState } from '@/store/store';
import { toast } from 'sonner';

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { playlists } = useSelector((state: RootState) => state.playlists);
  const { user } = useSelector((state: RootState) => state.auth);

  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Playlist not found</h1>
          <Button onClick={() => navigate('/playlists')}>Back to Playlists</Button>
        </div>
      </div>
    );
  }

  if (playlist.userId !== user?.id) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to view this playlist</p>
          <Button onClick={() => navigate('/playlists')}>Back to Playlists</Button>
        </div>
      </div>
    );
  }

  const handleRemoveSong = (songId: string) => {
    dispatch(removeSongFromPlaylist({ playlistId: playlist.id, songId }));
    toast.success('Song removed from playlist');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/playlists')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Playlists
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">{playlist.name}</h1>
              <p className="text-muted-foreground">
                {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </div>
        </div>

        {playlist.songs.length === 0 ? (
          <Card className="glass border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No songs yet</h3>
              <p className="text-muted-foreground mb-6">Start adding songs to your playlist</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {playlist.songs.map((song) => (
              <div key={song.id} className="relative group">
                <SongCard song={song} showAddButton={false} />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveSong(song.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
