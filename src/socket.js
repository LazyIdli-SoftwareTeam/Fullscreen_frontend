
import { URL } from '../src/utils/Constants';
import io from 'socket.io-client'; 
const socket = io(URL);

export default socket;