import axios from 'axios';

export const getPlayers = async (onAccept, onReject) => {
  try {
    const response = await axios.get(
      'https://leaderboard.straightdrive.xyz/sd/orbit/cricket/v1/kiosk/KIOSK123',
      {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo5LCJ1c2VySWQiOjksImVtYWlsIjoicGxheWFyZW5ha2lvc2sxQHN0cmFpZ2h0ZHJpdmVzcG9ydC5jb20iLCJpYXQiOjE3MTMxMDY0MDYsImV4cCI6MTc0NDY0MjQwNn0.qaDhildZ8FbUGrNby3mrLcswro1SCvanypNcBotJ0Ew',
        },
      }
    );
    onAccept(response);
  } catch (e) {
    onReject(e);
  }
};
