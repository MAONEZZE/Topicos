import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Music, Trash2, Edit, Play } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { addPlaylist, deletePlaylist, updatePlaylist } from '@/store/slices/playlistsSlice';
import { RootState } from '@/store/store';
import { toast } from 'sonner';

const Playlists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { playlists } = useSelector((state: RootState) => state.playlists);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState<{ id: string; name: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const userPlaylists = playlists.filter(p => p.userId === user?.id);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    if (!user) return;

    dispatch(addPlaylist({
      name: newPlaylistName,
      userId: user.id,
      songs: [],
    }));

    toast.success('Playlist created successfully!');
    setNewPlaylistName('');
    setCreateDialogOpen(false);
  };

  const handleUpdatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlaylist?.name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    const playlist = playlists.find(p => p.id === editingPlaylist.id);
    if (playlist) {
      dispatch(updatePlaylist({
        ...playlist,
        name: editingPlaylist.name,
      }));
      toast.success('Playlist updated successfully!');
      setEditingPlaylist(null);
      setEditDialogOpen(false);
    }
  };

  const confirmDelete = (id: string) => {
    setPlaylistToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeletePlaylist = () => {
    if (playlistToDelete) {
      dispatch(deletePlaylist(playlistToDelete));
      toast.success('Playlist deleted successfully');
      setDeleteDialogOpen(false);
      setPlaylistToDelete(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">My Playlists</h1>
            <p className="text-muted-foreground">Manage your music collections</p>
          </div>
          
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
                <DialogDescription>
                  Give your playlist a name to get started
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePlaylist} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Playlist Name</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Playlist"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="gradient" className="w-full">
                  Create Playlist
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {userPlaylists.length === 0 ? (
          <Card className="glass border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
              <p className="text-muted-foreground mb-6">Create your first playlist to get started</p>
              <Button variant="gradient" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Playlist
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPlaylists.map((playlist) => (
              <Card 
                key={playlist.id} 
                className="group hover:border-primary/50 transition-all duration-300 glass border-border/40 cursor-pointer"
                onClick={() => navigate(`/playlists/${playlist.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {playlist.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                      </CardDescription>
                    </div>
                    <Play className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPlaylist({ id: playlist.id, name: playlist.name });
                        setEditDialogOpen(true);
                      }}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(playlist.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
            <DialogDescription>
              Update your playlist name
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePlaylist} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Playlist Name</Label>
              <Input
                id="edit-name"
                placeholder="My Awesome Playlist"
                value={editingPlaylist?.name || ''}
                onChange={(e) => setEditingPlaylist(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
                required
              />
            </div>
            <Button type="submit" variant="gradient" className="w-full">
              Update Playlist
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your playlist
              and all its songs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlaylist} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Playlists;
