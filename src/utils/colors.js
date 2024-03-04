import {
  teal,
  purple,
  orange,
  deepPurple,
  deepOrange,
  indigo,
  blue,
  green,
  red,
  pink,
  yellow,
  cyan,
  lime,
} from "@mui/material/colors";

const colorPalette = [
  teal[500],
  purple[500],
  orange[500],
  deepPurple[500],
  deepOrange[500],
  indigo[500],
  blue[500],
  green[500],
  red[500],
  pink[500],
  yellow[500],
  cyan[500],
  lime[500],
];

export const generatePlayerColors = (players) => {
  const playerColors = {};
  players.forEach((player, index) => {
    playerColors[player.ownedBy] = colorPalette[index % colorPalette.length];
  });
  return playerColors;
};
