import { baseUrl } from "@/api/baseUrl";
import { observer } from "mobx-react-lite";
import Peer from "peerjs";
import { useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

type videoRef =  {current: HTMLVideoElement | null}

export const AdminPage = observer(() => {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);


  useEffect(() => {
    const socket = io(baseUrl+':90');

    const getLocalStream = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localRef.current) localRef.current.srcObject = localStream;
        return localStream
    };

    

    const peer = new Peer();
    getLocalStream().then((stream)=>{
      peer.on('open', function (id) {
        const data = {
          token: localStorage.getItem('access_token'),
          id,
        };
        socket.emit('entered', JSON.stringify(data));
        socket.once('entered', id => {
            peer.call(id, stream).on('stream', function(remoteStream) {
            if(remoteRef.current)remoteRef.current.srcObject = remoteStream
          });
        })
      });
  
      peer.on('call', function(call) {
        console.log('lol')
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function(remoteStream) {
          if(remoteRef.current)remoteRef.current.srcObject = remoteStream
        });
      });



    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <video ref={localRef} autoPlay muted style={{ width: '100%', maxHeight: '480px' }} />
      <video ref={remoteRef} autoPlay style={{ width: '100%', maxHeight: '480px' }} />

    </div>
  );
});


const setLocalStream = async (userRef: videoRef, deviceRef: videoRef) => {
  const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const deviceStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

  if (userRef.current) userRef.current.srcObject = userStream;
  if (deviceRef.current) deviceRef.current.srcObject = deviceStream;

  return [userStream, deviceStream]
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
};

const handleSignaling = (socket: Socket, peerConnection: RTCPeerConnection) => {
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
  return socket
};

const signal = async (peerConnection: RTCPeerConnection, socket: Socket) => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  const data = {
    token: localStorage.getItem('access_token'),
    offer,
  };
  socket.emit('offer', data);

}
