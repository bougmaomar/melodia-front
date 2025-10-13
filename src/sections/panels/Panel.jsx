import React from 'react';

import { motion } from 'framer-motion';

// material-ui
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import FadeInWhenVisible from './Animation';
import MainCard from 'components/MainCard';

// assets
import { ExportSquare } from 'iconsax-react';
import artistLogo from 'assets/images/regsiter/artist-register.png';
import agentLogo from 'assets/images/regsiter/agent-register.png';
import stationLogo from 'assets/images/regsiter/radio-register.png';
import { FormattedMessage } from 'react-intl';

const Panels = [
  {
    icon: artistLogo,
    title: <FormattedMessage id="register_artist" />,
    preview: '/artist/register'
  },
  {
    icon: agentLogo,
    title: <FormattedMessage id="register_agent" />,
    preview: '/agent/register'
  },
  {
    icon: stationLogo,
    title: <FormattedMessage id="register_station" />,
    preview: '/station/register'
  }
];

const Panel = () => {
  return (
    <Container>
      <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ mt: { md: 15, xs: 2.5 }, mb: { md: 10, xs: 2.5 } }}>
        <Grid item xs={12}>
          <Grid container spacing={2} justifyContent="center" sx={{ textAlign: 'center', marginBottom: 3 }}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.2
                }}
              >
                <Typography variant="h2">
                  <FormattedMessage id="join_us" />
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.4
                }}
              >
                <Typography>
                  <FormattedMessage id="register_description" />
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            {Panels.map((panel, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <FadeInWhenVisible>
                  <MainCard>
                    <Grid container spacing={3.5} direction="column" alignItems="center">
                      <Grid item xs={12}>
                        <Stack spacing={1} alignItems="center">
                          <Typography variant="h4">{panel.title}</Typography>
                          {/* <Typography>{panel.description}</Typography> */}
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <CardMedia component="img" image={panel.icon} sx={{ width: '100%' }} />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="large"
                          startIcon={<ExportSquare />}
                          component={Link}
                          href={panel.preview}
                          target="_blank"
                          sx={{
                            fontWeight: 500,
                            bgcolor: 'secondary.light',
                            color: 'secondary.darker',
                            '&:hover': { color: 'secondary.lighter' }
                          }}
                        >
                          <FormattedMessage id="register_now" />
                        </Button>
                      </Grid>
                    </Grid>
                  </MainCard>
                </FadeInWhenVisible>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Panel;
