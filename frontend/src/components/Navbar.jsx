import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import listIcon from "../assets/list.png"; // Đường dẫn tới ảnh icon menu ẩn

const Navbar = ({ title, menuItems, routes, active, setActive, showMenuIcon, onMenuClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserName(parsedData.last_name);
      setUserAvatar(parsedData.avatar || 'https://i.pravatar.cc/150?img=3');
    }
  }, []);

  // Toggle the drawer (mobile menu)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (item) => {
    if (setActive) {
      setActive(item); // Set active state
    }
    if (mobileOpen) {
      setMobileOpen(false); // Close the drawer on click
    }
  };

  const Logout = async () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    window.location.href = '/';
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#000", boxShadow: "none" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { xs: "block", xl: "none" }, mr: "5px" }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <img
            src="https://hcmut.edu.vn/img/nhanDienThuongHieu/01_logobachkhoatoi.png"
            alt="Logo"
            style={{ width: "100px", marginRight: "10px" }}
          />

          <Typography variant="h6" sx={{ flex: 1 }}>
            {title}
          </Typography>

          {menuItems.map((item, index) => (
            <Button
              key={index}
              component={Link}
              to={routes[index]}
              color="inherit"
              sx={{
                display: { xs: "none", xl: "inline-flex" },
                margin: "0 15px",
                padding: "10px 20px",
                color: active === item ? "#000000" : "#ffffff",
                fontWeight: active === item ? "bold" : "normal",
                backgroundColor: active === item ? "#ffffff" : "transparent",
                letterSpacing: "1.5px",
              }}
              onClick={() => handleMenuItemClick(item)}
            >
              {item}
            </Button>
          ))}

          {/* Hiển thị icon list.png nếu `showMenuIcon` là true */}
          {showMenuIcon && (
            <IconButton onClick={onMenuClick} sx={{ color: "white" }}>
              <img src={listIcon} alt="Menu" style={{ width: "30px", height: "30px" }} />
            </IconButton>
          )}

          <Typography
            variant="body1"
            sx={{
              marginRight: "15px",
              color: "white",
              fontSize: "16px",
              display: "inline-flex",
            }}
          >
            {userName || "Người dùng"}
          </Typography>
          <Avatar
            src={userAvatar}
            sx={{
              marginRight: "15px",
              display: "inline-flex",
            }}
          />

          <Button
            color="inherit"
            sx={{
              margin: "0 15px",
              padding: "10px 20px",
              backgroundColor: "#1E90FF",
              color: "#ffffff",
              ml: "auto",
              letterSpacing: "1.5px",
              display: "inline-flex",
            }}
            onClick={Logout}
          >
            Đăng xuất
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", xl: "none" },
          "& .MuiDrawer-paper": { width: 200, backgroundColor: "#000", color: "#fff" },
        }}
      >
        <List sx={{ padding: "90px 0 0 0" }}>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              component={Link}
              to={routes[index]}
              onClick={() => handleMenuItemClick(item)}
            >
              <ListItemText
                primary={item}
                sx={{
                  color: active === item ? "#000000" : "#fff",
                  fontWeight: active === item ? "bold" : "normal",
                  backgroundColor: active === item ? "#ffffff" : "transparent",
                  padding: "10px 20px",
                  borderRadius: "10px"
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
