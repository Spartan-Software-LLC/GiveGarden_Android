import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';

const pusher = Pusher.getInstance();

await pusher.init({
  apiKey: process.env.API_KEY,
  cluster: process.env.cluster,
});

await pusher.connect();
