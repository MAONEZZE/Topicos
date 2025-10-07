import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Music as MusicIcon, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import SongCard from '@/components/SongCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getExamplesSongs, searchTrack } from '@/services/audioDbApi';
import { setSearchResults, setLoading, clearSearchResults } from '@/store/slices/musicSlice';
import { addSongToPlaylist, SongAndPupular } from '@/store/slices/playlistsSlice';
import { RootState } from '@/store/store';
import { toast } from 'sonner';

const Music = () => {
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state: RootState) => state.music);
  const { playlists } = useSelector((state: RootState) => state.playlists);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<SongAndPupular | null>(null);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);

  const userPlaylists = playlists.filter(p => p.userId === user?.id);
  const [responseExampleSongs, setResponseExampleSongs] = useState<SongAndPupular[]>([]);

  useEffect(() => {
    const loadPopularSongs = async () => {
      const songs = await getExamplesSongs();
      setResponseExampleSongs(songs);
    };
    loadPopularSongs();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    dispatch(setLoading(true));
    const results = await searchTrack(searchQuery);
    
    dispatch(setSearchResults(results));
    
    if (results.length === 0) {
      toast.info('No songs found');
    } 
    else {
      toast.success(`Found ${results.length} songs!`);
    }
  };

  const handleAddToPlaylist = (song: SongAndPupular) => {
    if (userPlaylists.length === 0) {
      toast.error('Please create a playlist first');
      return;
    }
    setSelectedSong(song);
    setShowPlaylistDialog(true);
  };

  const addToPlaylist = (playlistId: string) => {
    if (selectedSong) {
      dispatch(addSongToPlaylist({ playlistId, song: selectedSong }));
      toast.success('Song added to playlist!');
      setShowPlaylistDialog(false);
      setSelectedSong(null);
    }
  };

  const handleClearResults = () => {
    dispatch(clearSearchResults());
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Browse Music</h1>
          <p className="text-muted-foreground">Search for your favorite songs</p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search for a good music!</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder={'Search by track name...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="gradient" className="flex-1" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
              {searchResults.length > 0 && (
                <Button type="button" variant="outline" onClick={handleClearResults}>
                  Clear
                </Button>
              )}
            </div>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <MusicIcon className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">Searching for music...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Search Results ({searchResults.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onAddToPlaylist={handleAddToPlaylist}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <MusicIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Searching</h3>
            <p className="text-muted-foreground">
              Use the search bar above to find songs by artist or track name
            </p>
          </div>
        )}
      </div>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <MusicIcon className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Other Songs</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <MusicIcon className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">Loading amazing music...</p>
          </div>
        ) : responseExampleSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {responseExampleSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onAddToPlaylist={handleAddToPlaylist}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">
            No songs found.
          </p>
        )}
      </section>


      <Dialog open={showPlaylistDialog} onOpenChange={setShowPlaylistDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Playlist</DialogTitle>
            <DialogDescription>
              Choose a playlist to add "{selectedSong?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {userPlaylists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => addToPlaylist(playlist.id)}
              >
                <MusicIcon className="mr-2 h-4 w-4" />
                {playlist.name} ({playlist.songs.length} songs)
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Music;
