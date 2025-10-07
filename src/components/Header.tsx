import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Music, Home, ListMusic, Search, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { logout } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">MusicHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link to="/home">
              <Button 
                variant={isActive('/home') ? 'default' : 'ghost'}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/playlists">
              <Button 
                variant={isActive('/playlists') ? 'default' : 'ghost'}
                className="gap-2"
              >
                <ListMusic className="h-4 w-4" />
                My Playlists
              </Button>
            </Link>
            <Link to="/music">
              <Button 
                variant={isActive('/music') ? 'default' : 'ghost'}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Browse Music
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
