import { baseUrl } from "@/api/baseUrl";
import { observer } from "mobx-react-lite";
import { useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

type videoRef =  {current: HTMLVideoElement | null}

export const AdminPage = observer(() => {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const remoteDeviceRef = useRef<HTMLVideoElement>(null);


  useEffect(() => {
    const socket = io(baseUrl+':90');
    const run = async () => {
      const streams = await setLocalStream(localRef)
      const connection = await createPeerConnection(streams, socket, [remoteRef, remoteDeviceRef])
      handleSignaling(connection)
      await signal(connection)
    }

    run()
    
    return () => {
      socket.disconnect();
      if(localRef.current?.srcObject)localRef.current.srcObject = null
      if(remoteDeviceRef.current?.srcObject)remoteDeviceRef.current.srcObject = null
      if(remoteRef.current?.srcObject)remoteRef.current.srcObject = null

    };
  }, []);

  return (
    <div>
      <video ref={localRef} autoPlay muted style={{ width: '100%', maxHeight: '480px' }} />
      <video ref={remoteRef} autoPlay style={{ width: '100%', maxHeight: '480px' }} />
      <video ref={remoteDeviceRef} autoPlay style={{ width: '100%', maxHeight: '480px' }} />


    </div>
  );
});


const setLocalStream = async (userRef: videoRef) => {
  console.log("au")
  const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  if (userRef.current) userRef.current.srcObject = userStream;

  return [userStream]
};

const createPeerConnection = (streams: MediaStream[], socket: Socket, remoteRef: videoRef[]) => {
  const iceServers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  const peerConnection = new RTCPeerConnection(iceServers);
  const remoteStream = new MediaStream();

  // Add local stream tracks to the peer connection
  streams.forEach((s)=>{
    s.getTracks().forEach((track) => {
      peerConnection.addTrack(track, s!);
    });
  })

  // Handle incoming remote stream
  peerConnection.ontrack = (event) => {
    event.streams.forEach((s,i)=>{
      s.getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      if (remoteRef[i].current) remoteRef[i].current.srcObject = remoteStream;
    })
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', event.candidate);
    }
  };

  return {peerConnection, socket}
};


type ConnectionProps = {socket: Socket, peerConnection: RTCPeerConnection}

const handleSignaling = ({socket, peerConnection}: ConnectionProps) => {
  socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
  });

  socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });
};

const signal = async ({socket, peerConnection}: ConnectionProps) => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  const data = {
    token: localStorage.getItem('access_token'),
    offer,
  };
  socket.emit('entered', data);
}
