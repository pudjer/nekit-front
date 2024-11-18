import { baseUrl } from "@/api/baseUrl";
import { MicOffRounded, MicRounded } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
type videoRef =  {current: HTMLVideoElement | null}




export const CallPage = observer((callbacks: Callbacks) => {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream>()
  const [audio, setAudio] = useState<boolean>(true)

  useEffect(() => {
    //@ts-ignore
    const socket = io(`${baseUrl}:${global.API_PORT}`);
    callbacks.setOnlineStatus && callbacks.setOnlineStatus("В очереди...")
    let peerConnection: RTCPeerConnection | undefined
    const run = async () => {
      const stream = await setLocalStream(localRef)
      localStream.current = stream
      peerConnection = await createPeerConnection(stream, socket, remoteRef, callbacks)
      await signal({peerConnection, socket})
    }

    run()
    
    return () => {
      socket.disconnect();
      if(peerConnection)peerConnection.close()
      if(localRef.current?.srcObject)localRef.current.srcObject = null
      if(remoteRef.current?.srcObject)remoteRef.current.srcObject = null
      if(localStream.current)localStream.current.getTracks().forEach(t=>t.stop())
      callbacks.setOnlineStatus && callbacks.setOnlineStatus("")
    };
  }, []);

  const toggleAudio = () => {
    if(localStream.current) localStream.current.getAudioTracks()[0].enabled = !audio
    setAudio(!audio)
  }


  return (
    <div style={{ width: '100%', height: '100%', justifyContent: "center", display: "flex" }}>
      
      <video ref={remoteRef} autoPlay style={{ width: '90%', border: "3px solid red"}}></video>
        <video ref={localRef} autoPlay muted style={{ maxWidth: '300px', maxHeight: '300px', position: "absolute", top: 77, border: "3px solid red", right: "10vw"}} />
        <Paper style={{ position: "absolute", bottom: "10vh", left: "10vw", width: 100, height: 120, display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
          <Button  onClick={toggleAudio}>{audio ? <MicRounded /> : <MicOffRounded/> }</Button>
          <Button onClick={callbacks.close}>закончить звонок</Button>
        </Paper>
    </div>
  );
});


const setLocalStream = async (userRef: videoRef) => {
  const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  if (userRef.current) userRef.current.srcObject = userStream;
  return userStream
};
type Callbacks = {close: ()=>void, setOnlineStatus?: (s: string)=>void,}

const createPeerConnection = (stream: MediaStream, socket: Socket, remoteRef: videoRef, cbs: Callbacks) => {
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
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });

  // Handle incoming remote stream
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
    if (remoteRef.current) remoteRef.current.srcObject = remoteStream;
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', event.candidate);
    }
  };
  
  peerConnection.onnegotiationneeded = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", peerConnection.localDescription);
  };

  socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
  });

  const setOnlineStatus = cbs.setOnlineStatus || (()=>{})
  const close = cbs.close

  peerConnection.addEventListener(
    "connectionstatechange",
    () => {
      switch (peerConnection.connectionState) {
        case "new":
        case "connecting":
          setOnlineStatus("Подключение...");
          break;
        case "connected":
          setOnlineStatus("Online");
          break;
        case "disconnected":
          setOnlineStatus("Переподключение...");
          break;
        case "closed":
          setOnlineStatus("Офлайн");
          close()
          socket.disconnect()
          break;
        case "failed":
          setOnlineStatus("Ошибка");
          close()
          socket.disconnect()
          break;
      }
  
    },
    false,
  );



  socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });

  socket.on("disconnect", ()=>{
    close()
  })
  

  return peerConnection
};


type ConnectionProps = {socket: Socket, peerConnection: RTCPeerConnection}



const signal = async ({socket, peerConnection}: ConnectionProps) => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  const data = {
    token: localStorage.getItem('access_token'),
    offer: peerConnection.localDescription,
  };
  socket.emit('entered', data);
}


