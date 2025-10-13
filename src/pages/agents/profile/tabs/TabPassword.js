import { useState } from 'react';

// material-ui
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { isNumber, isLowercaseChar, isUppercaseChar, isSpecialChar, minLength } from 'utils/password-validation';
import useAuth from 'hooks/useAuth';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import { Eye, EyeSlash, Minus, TickCircle } from 'iconsax-react';
import { useIntl, FormattedMessage } from 'react-intl';

// ==============================|| ACCOUNT PROFILE - PASSWORD CHANGE ||============================== //

const TabPassword = () => {
  const { artistResetPassword } = useAuth();
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);
  const { formatMessage } = useIntl();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <MainCard title={formatMessage({ id: 'changePass' })}>
      <Formik
        initialValues={{
          old: '',
          password: '',
          confirm: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          old: Yup.string().required(<FormattedMessage id="oldPassRequired" />),
          password: Yup.string()
            .required(<FormattedMessage id="newPassRequired" />)
            .matches(
              /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
              <FormattedMessage id="passwordMustGlobal" />
            )
            .test('confirm', <FormattedMessage id="oldPassDiffNew" />, (confirm, yup) => yup.parent.old !== confirm),
          confirm: Yup.string()
            .required(<FormattedMessage id="confirmPassRequired" />)
            .test('confirm', <FormattedMessage id="confirmPassMatch" />, (confirm, yup) => yup.parent.password === confirm)
        })}
        onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
          try {
            const res = await artistResetPassword(user.email, values.old, values.password);
            if (res === true) {
              dispatch(
                openSnackbar({
                  open: true,
                  message: <FormattedMessage id="changePassSuccess" />,
                  variant: 'success',
                  close: false
                })
              );
              window.location.href = '/agent/profile/basic';
            } else {
              setErrorMessage(res);
              dispatch(
                openSnackbar({
                  open: true,
                  message: <FormattedMessage id="changePassFail" />,
                  variant: 'error',
                  close: false
                })
              );
            }
            resetForm();
            setStatus({ success: false });
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item container spacing={3} xs={12} sm={6}>
                {/* Old password */}
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="password-old">
                      <FormattedMessage id="oldPass" />
                    </InputLabel>
                    <OutlinedInput
                      id="password-old"
                      placeholder={formatMessage({ id: 'oldPassEnter' })}
                      type={showOldPassword ? 'text' : 'password'}
                      value={values.old}
                      name="old"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowOldPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary"
                          >
                            {showOldPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-old"
                    />
                    {touched.old && errors.old && (
                      <FormHelperText error id="password-old-helper">
                        {errors.old}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                {/* NEw password */}
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="password-password">
                      <FormattedMessage id="newPass" />
                    </InputLabel>
                    <OutlinedInput
                      id="password-password"
                      placeholder={formatMessage({ id: 'newPassEnter' })}
                      type={showNewPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary"
                          >
                            {showNewPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-password"
                    />
                    {touched.password && errors.password && (
                      <FormHelperText error id="password-password-helper">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                {/* confirm password */}
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="password-confirm">
                      <FormattedMessage id="confirmPass" />
                    </InputLabel>
                    <OutlinedInput
                      id="password-confirm"
                      placeholder={formatMessage({ id: 'confirmPassEnter' })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirm}
                      name="confirm"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary"
                          >
                            {showConfirmPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-confirm"
                    />
                    {touched.confirm && errors.confirm && (
                      <FormHelperText error id="password-confirm-helper">
                        {errors.confirm}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: { xs: 0, sm: 2, md: 4, lg: 5 } }}>
                  <Typography variant="h5">
                    <FormattedMessage id="passwordContain" />:
                  </Typography>
                  <List sx={{ p: 0, mt: 1 }}>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: minLength(values.password) ? 'success.main' : 'inherit' }}>
                        {minLength(values.password) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary={formatMessage({ id: 'leastCharacter' })} />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isLowercaseChar(values.password) ? 'success.main' : 'inherit' }}>
                        {isLowercaseChar(values.password) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary={formatMessage({ id: 'leastLower' })} />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isUppercaseChar(values.password) ? 'success.main' : 'inherit' }}>
                        {isUppercaseChar(values.password) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary={formatMessage({ id: 'leastNumber' })} />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isNumber(values.password) ? 'success.main' : 'inherit' }}>
                        {isNumber(values.password) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary={formatMessage({ id: 'leastSpecial' })} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ color: isSpecialChar(values.password) ? 'success.main' : 'inherit' }}>
                        {isSpecialChar(values.password) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary={formatMessage({ id: 'leastUpper' })} />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                  <Button variant="outlined" color="secondary">
                    <FormattedMessage id="cancel" />
                  </Button>
                  <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                    <FormattedMessage id="updatePassword" />
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default TabPassword;
