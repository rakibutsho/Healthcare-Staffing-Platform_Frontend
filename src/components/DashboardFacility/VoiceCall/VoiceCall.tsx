"use client";

import React, { useEffect, useRef, useState } from "react";
import AgoraRTC, { ILocalAudioTrack } from "agora-rtc-sdk-ng";
import { useSearchParams } from "next/navigation";

const VoiceCall = () => {
  const [joined, setJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const conversationId = useSearchParams().get("id");
  const clientRef = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  );
  const localAudioRef = useRef<ILocalAudioTrack | null>(null);

  const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID as string;
  const CHANNEL = "test";
  const TOKEN =
    "007eJxTYOjybj2ieJOZr/7a6w1n3VTMjO3EA2f/7imZu/XNpFJpSWYFBkNL01RzS9MU42RTUxPLVIvExFRzo2TTVDNjI+MUS2MTLcdzGQ2BjAxFK2qYGRkgEMRnYShJLS5hYAAA3S0dzg==";
  const UID = 0;

  useEffect(() => {
    const initCall = async () => {
      const client = clientRef.current;

      // Listen for remote users
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
        setRemoteUsers((prev) => {
          if (prev.find((u) => u.uid === user.uid)) return prev;
          return [...prev, user];
        });
      });

      client.on("user-unpublished", (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });
    };

    initCall();
  }, []);

  const joinCall = async () => {
    const client = clientRef.current;
    await client.join(APP_ID, CHANNEL, TOKEN, UID);

    // Create local audio track
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    localAudioRef.current = localAudioTrack;
    await client.publish([localAudioTrack]);

    setJoined(true);
  };

  const leaveCall = async () => {
    const client = clientRef.current;
    localAudioRef.current?.close();
    await client.leave();
    setJoined(false);
    setRemoteUsers([]);
  };

  return (
    <div className="text-center bg-gradient-to-b from-blue-50 to-teal-50 pt-[150px] pb-[50px]">
      {joined ? (
        <div className="inline-block">
          <div className="md:w-xl bg-[#2d2d2d] text-white p-7 rounded-md space-y-6">
            <h3>In Call...</h3>
            <button
              onClick={leaveCall}
              className="bg-[#FF4D4F] text-white px-8 py-3 rounded-md cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      ) : (
        <div className="inline-block">
          <h3
            onClick={joinCall}
            className="bg-[#193e58] text-white px-8 py-3 rounded-md cursor-pointer"
          >
            Start Call
          </h3>
        </div>
      )}
    </div>
  );
};

export default VoiceCall;
