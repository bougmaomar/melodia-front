import { lazy } from 'react';

// project-imports
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import RoleGuard from 'utils/route-guard/RoleGuard';

const Dashboard = Loadable(lazy(() => import('pages/extra-pages/dashboard')));
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceError403 = Loadable(lazy(() => import('pages/maintenance/error/401')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));

const Registration = Loadable(lazy(() => import('pages/registration')));

const AdminDashboard = Loadable(lazy(() => import('pages/admins/dashboard/dashboard')));
const AdminArtists = Loadable(lazy(() => import('pages/admins/artistsList')));
const AdminAgents = Loadable(lazy(() => import('pages/admins/agentsList')));
const AdminStations = Loadable(lazy(() => import('pages/admins/stationsList')));
// const AdminAccesses = Loadable(lazy(() => import('pages/admins/accesses')));
const AdminLanguages = Loadable(lazy(() => import('pages/admins/languages')));
const AdminMusicGenres = Loadable(lazy(() => import('pages/admins/musicGenres')));
const AdminRoles = Loadable(lazy(() => import('pages/admins/roles')));
const AdminPositions = Loadable(lazy(() => import('pages/admins/positions')));
const AdminStationTypes = Loadable(lazy(() => import('pages/admins/stationTypes')));
const AdminProgramTypes = Loadable(lazy(() => import('pages/admins/programType')));

// const ArtistAlbums = Loadable(lazy(() => import('pages/artists/albums')));
const ArtistDashboard = Loadable(lazy(() => import('pages/artists/dashboard/dashboard')));
const ArtistAlbums = Loadable(lazy(() => import('pages/artists/albums/albums')));
const AddAlbum = Loadable(lazy(() => import('pages/artists/albums/add-album')));
const UpdateAlbum = Loadable(lazy(() => import('pages/artists/albums/modify-album')));
const ArtistAlbumsDetails = Loadable(lazy(() => import('pages/artists/albums/album-details')));
const ArtistSongs = Loadable(lazy(() => import('pages/artists/songs')));
const ArtistSongDetails = Loadable(lazy(() => import('pages/artists/songs/song-details')));
const ArtistAddSong = Loadable(lazy(() => import('pages/artists/songs/add-song')));
const ArtistModifySong = Loadable(lazy(() => import('pages/artists/songs/modify-song')));
const ArtistStations = Loadable(lazy(() => import('pages/artists/stations/StationsList')));
const ArtistStationDetails = Loadable(lazy(() => import('pages/artists/stations/StationDetails')));
const ArtistProfile = Loadable(lazy(() => import('pages/artists/profile/profileTabs')));
const ArtistViewProfile = Loadable(lazy(() => import('pages/artists/profile/tabs/ViewProfile')));
const ArtistUpdateProfile = Loadable(lazy(() => import('pages/artists/profile/tabs/UpdateProfile')));
const ArtistUpdatePassword = Loadable(lazy(() => import('pages/artists/profile/tabs/UpdatePassword')));
const ArtistFavoriteSongs = Loadable(lazy(() => import('pages/artists/favorite/songs')));
const ArtistChat = Loadable(lazy(() => import('pages/artists/chat/chat')));

const Suggestion = Loadable(lazy(() => import('pages/artists/suggestion')));
// const AppECommProducts = Loadable(lazy(() => import('pages/apps/e-commerce/product')));

const AgentDashboard = Loadable(lazy(() => import('pages/agents/dashboard/dashboard')));
const AgentChat = Loadable(lazy(() => import('pages/agents/chat/chat')));
const AgentArtistDash = Loadable(lazy(() => import('pages/agents/dashboard/artistDash')));
const AgentArtists = Loadable(lazy(() => import('pages/agents/artists/Artists')));
const AgentArtistDetails = Loadable(lazy(() => import('pages/agents/artists/artist_details')));
const AgentListAlbums = Loadable(lazy(() => import('pages/agents/albums/albums')));
const AgentAddAlbum = Loadable(lazy(() => import('pages/agents/albums/add-album')));
const AgentUpdateAlbum = Loadable(lazy(() => import('pages/agents/albums/modify-album')));
const AgentAlbumDetails = Loadable(lazy(() => import('pages/agents/albums/album-details')));
const AgentListSongs = Loadable(lazy(() => import('pages/agents/songs/songs')));
const AgentFavoriteSongs = Loadable(lazy(() => import('pages/agents/favorite/songs')));
const AgentSongDetails = Loadable(lazy(() => import('pages/agents/songs/song-details')));
const AgentAddSong = Loadable(lazy(() => import('pages/agents/songs/add-song')));
const AgentUpdateSong = Loadable(lazy(() => import('pages/agents/songs/modify-song')));
const AgentStations = Loadable(lazy(() => import('pages/agents/stations/StationsList')));
const AgentStationDetails = Loadable(lazy(() => import('pages/agents/stations/StationDetails')));
const AgentSuggestion = Loadable(lazy(() => import('pages/agents/suggestion/index')));
const AgentProfile = Loadable(lazy(() => import('pages/agents/profile/profileTabs')));
const AgentTabProfile = Loadable(lazy(() => import('pages/agents/profile/tabs/TabProfile')));
const AgentTabPersonal = Loadable(lazy(() => import('pages/agents/profile/tabs/TabPersonal')));
const AgentTabPasswoed = Loadable(lazy(() => import('pages/agents/profile/tabs/TabPassword')));

const RadioStationDashboard = Loadable(lazy(() => import('pages/stations/dashboard/dashboard')));
const RadioStationArtists = Loadable(lazy(() => import('pages/stations/artists/listOfArtists')));
const RadioStationArtistProfile = Loadable(lazy(() => import('pages/stations/artists/profileArtist')));
const RadioStationSongDetail = Loadable(lazy(() => import('pages/stations/songs/song-details')));
const RadioStationProposals = Loadable(lazy(() => import('pages/stations/proposals/proposals')));
const RadioStationListen = Loadable(lazy(() => import('pages/stations/songs/listenSpace')));
const RadioStationSelectedSongs = Loadable(lazy(() => import('pages/stations/songs/selected')));
const RadioStationChat = Loadable(lazy(() => import('pages/stations/chat/chat')));
const RadioStationProfile = Loadable(lazy(() => import('pages/stations/profile/tabs')));
const RadioStationViewProfile = Loadable(lazy(() => import('pages/stations/profile/tabs/viewProfile')));
const RadioStationUpdateProfile = Loadable(lazy(() => import('pages/stations/profile/tabs/updateProfile')));
const RadioStationUpdatePassword = Loadable(lazy(() => import('pages/stations/profile/tabs/updatePassword')));

const Logout = Loadable(lazy(() => import('menu-items/logout-menu')));
const SpotifyStats = Loadable(lazy(() => import('sections/dashboard/statistics/SpotifyStats')));
// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/logout',
      element: <Logout />
    },
    {
      path: '/spotify',
      element: <SpotifyStats />
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: '/',
          children: [
            {
              path: 'dashboard',
              element: <Dashboard />
            },
            // artist paths
            {
              path: 'artist',
              children: [
                {
                  path: 'dashboard',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistDashboard />
                    </RoleGuard>
                  )
                },
                {
                  path: 'albums',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistAlbums />
                    </RoleGuard>
                  )
                },
                {
                  path: 'albums/add-album',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <AddAlbum />
                    </RoleGuard>
                  )
                },
                {
                  path: 'albums/update-album/:id',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <UpdateAlbum />
                    </RoleGuard>
                  )
                },
                {
                  path: 'album-details/:id',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistAlbumsDetails />
                    </RoleGuard>
                  )
                },
                {
                  path: 'songs',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistSongs />
                    </RoleGuard>
                  )
                },
                {
                  path: 'favorite',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistFavoriteSongs />
                    </RoleGuard>
                  )
                },
                {
                  path: 'songs-details/:id',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistSongDetails />
                    </RoleGuard>
                  )
                },
                {
                  path: 'add-song',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistAddSong />
                    </RoleGuard>
                  )
                },
                {
                  path: 'update-song/:id',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistModifySong />
                    </RoleGuard>
                  )
                },
                {
                  path: 'stations',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistStations />
                    </RoleGuard>
                  )
                },
                {
                  path: 'stations/details/:id',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistStationDetails />
                    </RoleGuard>
                  )
                },
                {
                  path: 'profile',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistProfile />
                    </RoleGuard>
                  ),
                  children: [
                    {
                      path: 'basic',
                      element: (
                        <RoleGuard roles={['Artist']}>
                          <ArtistViewProfile />
                        </RoleGuard>
                      )
                    },
                    {
                      path: 'personal',
                      element: (
                        <RoleGuard roles={['Artist']}>
                          <ArtistUpdateProfile />
                        </RoleGuard>
                      )
                    },
                    {
                      path: 'password',
                      element: (
                        <RoleGuard roles={['Artist']}>
                          <ArtistUpdatePassword />
                        </RoleGuard>
                      )
                    }
                  ]
                },
                {
                  path: 'suggest/:id',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <Suggestion />
                    </RoleGuard>
                  )
                },
                {
                  path: 'chat',
                  element: (
                    <RoleGuard roles={['Artist']}>
                      <ArtistChat />
                    </RoleGuard>
                  )
                }
              ]
            }
          ]
        },
        {
          path: '/',
          children: [
            {
              path: 'dashboard',
              element: <Dashboard />
            },
            // station paths
            {
              path: 'radio-station',
              children: [
                {
                  path: 'dashboard',
                  element: (
                    <RoleGuard roles={['Station']}>
                      <RadioStationDashboard />
                    </RoleGuard>
                  )
                },
                {
                  path: 'artists',
                  element: (
                    <RoleGuard roles={['Station']}>
                      <RadioStationArtists />
                    </RoleGuard>
                  )
                },
                {
                  path: 'artist/:id',
                  element: (
                    <RoleGuard roles={['Station']}>
                      <RadioStationArtistProfile />
                    </RoleGuard>
                  )
                },
                {
                  path: 'chat',
                  element: (
                    <RoleGuard roles={['Station']}>
                      <RadioStationChat />
                    </RoleGuard>
                  )
                },
                {
                  path: 'profile',
                  element: (
                    <RoleGuard roles={['Station']}>
                      <RadioStationProfile />
                    </RoleGuard>
                  ),
                  children: [
                    {
                      path: 'basic',
                      element: (
                        <RoleGuard roles={['Station']}>
                          <RadioStationViewProfile />
                        </RoleGuard>
                      )
                    },
                    {
                      path: 'personal',
                      element: (
                        <RoleGuard roles={['Station']}>
                          <RadioStationUpdateProfile />
                        </RoleGuard>
                      )
                    },
                    {
                      path: 'password',
                      element: (
                        <RoleGuard roles={['Station']}>
                          <RadioStationUpdatePassword />
                        </RoleGuard>
                      )
                    }
                  ]
                },
                {
                  path: 'songs/details/:id/:status',
                  element: (
                    <RoleGuard roles={['Station']}>
                      <RadioStationSongDetail />
                    </RoleGuard>
                  )
                },
                {
                  path: 'proposals',
                  element: (
                    <RoleGuard roles={['Station']}>
                      <RadioStationProposals />
                    </RoleGuard>
                  )
                },
                {
                  path: 'listen',
                  element: (
                    <RoleGuard roles={['Station']}>
                      <RadioStationListen />
                    </RoleGuard>
                  )
                },
                {
                  path: 'selected',
                  element: (
                    <RoleGuard roles={['Station']}>
                      <RadioStationSelectedSongs />
                    </RoleGuard>
                  )
                }
              ]
            }
          ]
        },
        {
          path: '/',
          children: [
            {
              path: 'dashboard',
              element: <Dashboard />
            },
            // agent paths
            {
              path: 'agent',
              children: [
                {
                  path: 'dashboard',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentDashboard />
                    </RoleGuard>
                  )
                },
                {
                  path: 'artistdashboard/:id',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentArtistDash />
                    </RoleGuard>
                  )
                },
                {
                  path: 'artists',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentArtists />
                    </RoleGuard>
                  )
                },
                {
                  path: 'artist/artist_detail/:email',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentArtistDetails />
                    </RoleGuard>
                  )
                },
                {
                  path: 'albums',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentListAlbums />
                    </RoleGuard>
                  )
                },
                {
                  path: 'albums/add-album/:id',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentAddAlbum />
                    </RoleGuard>
                  )
                },
                {
                  path: 'albums/update-album/:id',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentUpdateAlbum />
                    </RoleGuard>
                  )
                },
                {
                  path: 'albums/album-details/:id',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentAlbumDetails />
                    </RoleGuard>
                  )
                },
                {
                  path: 'favorite',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentFavoriteSongs />
                    </RoleGuard>
                  )
                },
                {
                  path: 'songs',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentListSongs />
                    </RoleGuard>
                  )
                },
                {
                  path: 'songs-details/:id',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentSongDetails />
                    </RoleGuard>
                  )
                },
                {
                  path: 'songs/add-song/:id',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentAddSong />
                    </RoleGuard>
                  )
                },
                {
                  path: 'songs/update-song/:id',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentUpdateSong />
                    </RoleGuard>
                  )
                },
                {
                  path: 'stations',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentStations />
                    </RoleGuard>
                  )
                },
                {
                  path: 'stations/details/:id',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentStationDetails />
                    </RoleGuard>
                  )
                },
                {
                  path: 'suggest/:stationid',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentSuggestion />
                    </RoleGuard>
                  )
                },
                {
                  path: 'chat',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentChat />
                    </RoleGuard>
                  )
                },
                {
                  path: 'profile',
                  element: (
                    <RoleGuard roles={['Agent']}>
                      <AgentProfile />
                    </RoleGuard>
                  ),
                  children: [
                    {
                      path: 'basic',
                      element: (
                        <RoleGuard roles={['Agent']}>
                          <AgentTabProfile />
                        </RoleGuard>
                      )
                    },
                    {
                      path: 'personal',
                      element: (
                        <RoleGuard roles={['Agent']}>
                          <AgentTabPersonal />
                        </RoleGuard>
                      )
                    },
                    {
                      path: 'password',
                      element: (
                        <RoleGuard roles={['Agent']}>
                          <AgentTabPasswoed />
                        </RoleGuard>
                      )
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          path: '/',
          children: [
            // admin paths
            {
              path: 'admin',
              children: [
                {
                  path: 'dashboard',
                  element: (
                    <RoleGuard roles={['Admin']}>
                      <AdminDashboard />
                    </RoleGuard>
                  )
                },
                {
                  path: 'manage-positions',
                  element: (
                    <RoleGuard roles={['Admin']}>
                      <AdminPositions />
                    </RoleGuard>
                  )
                },
                {
                  path: 'manage-station-types',
                  element: (
                    <RoleGuard roles={['Admin']}>
                      <AdminStationTypes />
                    </RoleGuard>
                  )
                },
                {
                  path: 'manage-program-types',
                  element: (
                    <RoleGuard roles={['Admin']}>
                      <AdminProgramTypes />
                    </RoleGuard>
                  )
                },
                {
                  path: 'manage-artists',
                  element: (
                    <RoleGuard roles={['Admin']}>
                      <AdminArtists />
                    </RoleGuard>
                  )
                },
                {
                  path: 'manage-agents',
                  element: (
                    <RoleGuard roles={['Admin']}>
                      <AdminAgents />
                    </RoleGuard>
                  )
                },
                {
                  path: 'manage-stations',
                  element: (
                    <RoleGuard roles={['Admin']}>
                      <AdminStations />
                    </RoleGuard>
                  )
                },
                {
                  path: 'manage-languages',
                  element: (
                    <RoleGuard roles={['Admin']}>
                      <AdminLanguages />
                    </RoleGuard>
                  )
                },
                {
                  path: 'manage-musicGenres',
                  element: (
                    <RoleGuard roles={['Admin']}>
                      <AdminMusicGenres />
                    </RoleGuard>
                  )
                },
                {
                  path: 'manage-roles',
                  element: (
                    <RoleGuard roles={['Admin']}>
                      <AdminRoles />
                    </RoleGuard>
                  )
                }
              ]
            }
          ]
        },
        {
          path: '/',
          children: [
            // manage paths
            {
              path: 'manage',
              children: [
                {
                  path: 'settings',
                  element: <></>
                },
                {
                  path: 'billing',
                  element: <></>
                }
              ]
            }
          ]
        }
      ]
    },

    {
      path: '/',
      children: [
        // registration
        {
          path: 'registration',
          element: <Registration />
        }
      ]
    },
    // maintenance
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '401',
          element: <MaintenanceError403 />
        },
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    }
  ]
};

export default MainRoutes;
