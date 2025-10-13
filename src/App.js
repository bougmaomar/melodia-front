import React, { useEffect, useState } from 'react';

// project-imports
import Routes from 'routes';
import ThemeCustomization from 'themes';

import Loader from 'components/Loader';
import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

import { dispatch } from 'store';
import { fetchMenu } from 'store/reducers/menu';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { AlbumProvider } from 'contexts/AlbumContext';
import { ChatProvider } from 'contexts/ChatContext';
import UserProvider from 'contexts/UserContext';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchMenu()).then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <ThemeCustomization>
      <RTLLayout>
        <Locales>
          <ScrollTop>
            <ChatProvider>
              <UserProvider>
                <AlbumProvider>
                  <AuthProvider>
                    <Notistack>
                      <Routes />
                      <Snackbar />
                    </Notistack>
                  </AuthProvider>
                </AlbumProvider>
              </UserProvider>
            </ChatProvider>
          </ScrollTop>
        </Locales>
      </RTLLayout>
    </ThemeCustomization>
  );
};

export default App;
