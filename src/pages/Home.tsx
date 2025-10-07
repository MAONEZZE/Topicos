import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Music, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import SongCard from '@/components/SongCard';
import { Button } from '@/components/ui/button';
import { getPopularSongs } from '@/services/audioDbApi';
import { setPopularSongs, setLoading } from '@/store/slices/musicSlice';
import { RootState } from '@/store/store';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PopularMusicCountry, Song, SongAndPupular } from '@/store/slices/playlistsSlice';
import { addSongToPlaylist } from '@/store/slices/playlistsSlice';
import heroImage from '@/assets/hero-music.jpg';

const Home = () => {
  const dispatch = useDispatch();
  const { popularSongs, loading } = useSelector((state: RootState) => state.music);
  const { playlists } = useSelector((state: RootState) => state.playlists);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedSong, setSelectedSong] = useState<SongAndPupular | null>(null);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);

  const userPlaylists = playlists.filter(p => p.userId === user?.id);

  // Lista de países e abreviações
  const countries = [
    { name: 'United States', code: 'us' },
    { name: 'England', code: 'gb' },
    { name: 'Germani', code: 'de' }
  ];

  useEffect(() => {
    loadAllCountriesSongs();
  }, []);

  // Carrega as músicas de todos os países
  const loadAllCountriesSongs = async () => {
    dispatch(setLoading(true));
    const allSongs: Record<string, PopularMusicCountry[]> = {};

    for (const country of countries) {
      try {
        const songs = await loadPopularSongs(country.code);
        allSongs[country.code] = songs || [];
      }
      catch {
        allSongs[country.code] = [];
      }
    }

    dispatch(setPopularSongs(allSongs));
    dispatch(setLoading(false));
  };

  // Agora o método recebe o código do país
  const loadPopularSongs = async (countryCode: string) => {
    try {
      const response = await getPopularSongs(countryCode);
      return response;
    } catch (error) {
      console.error(`Erro ao carregar músicas de ${countryCode}:`, error);
      return [];
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

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-4">
            Discover Amazing Music
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Create and manage your personalized playlists with millions of songs
          </p>
        </div>
      </section>

      {/* Popular Songs by Country */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Popular Songs by Country</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Music className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">Loading amazing music...</p>
          </div>
        ) : (
          countries.map((country) => (
            <div key={country.code} className="mb-10">
              <h3 className="text-2xl font-semibold mb-4">{country.name}</h3>

              {popularSongs[country.code]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularSongs[country.code].map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      onAddToPlaylist={handleAddToPlaylist}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mb-4">No songs found for {country.name}</p>
              )}
            </div>
          ))
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
                <Music className="mr-2 h-4 w-4" />
                {playlist.name} ({playlist.songs.length} songs)
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
