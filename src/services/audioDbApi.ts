import { PopularMusicCountry, Song, SongAndPupular } from '@/store/slices/playlistsSlice';
import Artist from './musicas.json'

const API_BASE_URL = 'https://www.theaudiodb.com/api/v1/json/123';

interface AudioDbTrack {
  idTrack: string;
  strTrack: string;
  strArtist: string;
  strGenre: string;
  intYearReleased: string;
  strTrackThumb?: string;
}

export interface PopularMusicCountryTrack {
  idArtist: string;
  idAlbum: string;
  idTrack: string;
  strArtist: string;
  strAlbum:	string;
  strTrack:	string;
  strTrackThumb: string;
  strType: string;
}


const transformTrackToSong = (track: AudioDbTrack): Song => ({
  id: track.idTrack,
  name: track.strTrack,
  artist: track.strArtist,
  genre: track.strGenre || 'Unknown',
  year: track.intYearReleased || 'Unknown',
  thumbnail: track.strTrackThumb
});

const tranformPopularSong = (track: PopularMusicCountryTrack): SongAndPupular => ({
  idArtist: track.idArtist,
  idAlbum: track.idAlbum ,
  id: track.idTrack ,
  artist: track.strArtist,
  album: track.strAlbum,
  name: track.strTrack,
  thumbnail: track.strTrackThumb,
  type: track.strType,
  genre: '',
  year: ''
});

export const searchTrack = async (trackName: string): Promise<SongAndPupular[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mostloved.php?format=${encodeURIComponent(trackName)}`);
    const data = await response.json();

    if (!data.track) {
      return [];
    }

    return data.track.slice(0, 10).map(transformTrackToSong);
  } catch (error) {
    console.error('Error searching track:', error);
    return [];
  }
};

export const getExamplesSongs = async (): Promise<SongAndPupular[]> => {
  try {
    const popularArtists = [
      'coldplay',
      'the_beatles',
      'queen',
      'pink_floyd',
      'led_zeppelin',
      'the_who',
      'mac_demarco',
      'imagine_dragons'
    ];

    const fetchPromises: Promise<any>[] = [];

    for (const artist of popularArtists) {
      for (const music of Artist[artist]) {
        const url = `${API_BASE_URL}/searchtrack.php?s=${artist}&t=${music}`;
        fetchPromises.push(fetch(url).then(res => res.json()));
      }
    }

    const results = await Promise.all(fetchPromises);

    const songs: any[] = [];

    for (const json of results) {
      if (json.track) {
        songs.push(...json.track);
      }
    }

    // transforma todas as faixas em objetos padronizados
    return songs.map(tranformPopularSong);

  } catch (error) {
    console.error('erro nas músicas de exemplo:', error);
    return [];
  }
};

export const getPopularSongs = async (country): Promise<PopularMusicCountry[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/trending.php?country=${country}&type=itunes&format=singles`);
    const data = await response.json();

    if (!data.trending) {
      console.log('Sem dadoooooos')
      return [];
    }

    const dataFormat = data.trending.map(tranformPopularSong);
    return dataFormat
  } 
  catch (error) {
    console.error("erro nas musicas populares");
    return [];
  }
};
