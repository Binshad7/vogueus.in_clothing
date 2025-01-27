import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  LogOut,
  Bell,
  Moon,
  Shield,
  Globe,
  Mail,
  Smartphone,
  HelpCircle,
  Info
} from 'lucide-react';
import { userLogout } from '../../../store/middlewares/user/user_auth';
import { useDispatch } from 'react-redux';
const Settings = () => {
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    twoFactorAuth: false,
    emailUpdates: true,
    mobileNotifications: true,
  });
  const dispatch = useDispatch();
  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const onLogOut = useCallback(() => {
   const result =  dispatch(userLogout());
   if(userLogout.fulfilled.match(result)){
    navigate('/')
   }
  }, [navigate]);

  const settingsList = [
    {
      title: 'Notifications',
      description: 'Receive notifications about your account',
      icon: <Bell size={20} />,
      setting: 'notifications'
    },
    {
      title: 'Dark Mode',
      description: 'Switch between light and dark theme',
      icon: <Moon size={20} />,
      setting: 'darkMode'
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security',
      icon: <Shield size={20} />,
      setting: 'twoFactorAuth'
    },
    {
      title: 'Email Updates',
      description: 'Receive email updates about our services',
      icon: <Mail size={20} />,
      setting: 'emailUpdates'
    },
    {
      title: 'Mobile Notifications',
      description: 'Receive notifications on your mobile device',
      icon: <Smartphone size={20} />,
      setting: 'mobileNotifications'
    }
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Preferences
            </Typography>
            <List>
              {settingsList.map((item, index) => (
                <React.Fragment key={item.setting}>
                  <ListItem>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={item.description}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings[item.setting]}
                        onChange={() => handleSettingChange(item.setting)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < settingsList.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Help & Support
            </Typography>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <HelpCircle size={20} />
                </ListItemIcon>
                <ListItemText
                  primary="FAQ"
                  secondary="Frequently asked questions"
                />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemIcon>
                  <Globe size={20} />
                </ListItemIcon>
                <ListItemText
                  primary="Language"
                  secondary="Choose your preferred language"
                />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemIcon>
                  <Info size={20} />
                </ListItemIcon>
                <ListItemText
                  primary="About"
                  secondary="Learn more about our service"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogOut size={20} />}
            onClick={() => setOpenLogoutDialog(true)}
            sx={{
              width: 200,
              height: 48,
              textTransform: 'none'
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={openLogoutDialog}
          onClose={() => setOpenLogoutDialog(false)}
        >
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to logout? You will need to login again to access your account.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenLogoutDialog(false)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              onClick={onLogOut}
              variant="contained"
              color="error"
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Settings;