import React from 'react';
import './App.css';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { MonitorHeart } from "@mui/icons-material";
import { AppHeaderComponent } from "./AppHeaderComponent";


function App() {

  return (
    <AppHeaderComponent/>
  );
}

export default App;
