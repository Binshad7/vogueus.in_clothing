import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { User, ShoppingBag, Settings, LogOut } from "lucide-react";
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Paper } from "@mui/material";
import { userLogout } from "../../../store/middlewares/user/user_auth";

const Account = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const menuItems = [
    {
      path: "/account-details/profile",
      name: "Profile",
      icon: <User />,
    },
    {
      path: "/account-details/orders",
      name: "Orders",
      icon: <ShoppingBag />,
    },
    {
      path: "/account-details/settings",
      name: "Settings",
      icon: <Settings />,
    },
  ];

  const handleLogout = async () => {
    const result = await dispatch(userLogout())
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <Paper sx={{ padding: 2, marginBottom: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Welcome back, {user?.userName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and view your orders.
        </Typography>
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <Box sx={{ flex: 1, maxWidth: 240 }}>
          <List sx={{ width: "100%" }}>
            {menuItems.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                style={{ textDecoration: "none" }}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <ListItem
                  button
                  sx={{
                    padding: "12px 16px",
                    borderRadius: 2,
                    "&.active-link": {
                      backgroundColor: "#e0f7fa",
                      fontWeight: "bold",
                      "&:hover": { backgroundColor: "#b2ebf2" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              </NavLink>
            ))}
            <Divider sx={{ marginY: 2 }} />
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                padding: "12px 16px",
                borderRadius: 2,
                backgroundColor: "#ffecec",
                "&:hover": { backgroundColor: "#f8d7da" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#d32f2f" }}

              >
                <LogOut />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ color: "#d32f2f", fontWeight: "bold" }}
              />
            </ListItem>
          </List>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ marginLeft: 2, marginRight: 2 }} />

        <Box sx={{ flex: 3, padding: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Account;
