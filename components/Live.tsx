"use client";
import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors'
import { useBroadcastEvent, useMyPresence, useOthers } from '@/liveblocks.config'
import CursorChat from './cursor/CursorChat';
import { CursorMode, CursorState, Reaction } from '@/types/type';
import ReactionSelector from './reaction/ReactionButton';
import FlyingReaction from './reaction/FlyingReaction';
import useInterval from '@/hooks/useInterval';

const Live = () => {
  const others = useOthers();
  const [{cursor}, updateMyPresence] = useMyPresence() as any;
  const broadcast = useBroadcastEvent();
  const [cursorState,setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  })
  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);
  const [reactions, setReactions] = useState<Reaction[]>([]);


  useInterval(() => {
    setReactions((reactions) => reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000));
  }, 1000);


  useInterval(() => {
    if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
      // concat all the reactions created on mouse click
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])
      );

      // Broadcast the reaction to other users
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);



  const handlePointerMove = useCallback( (event: React.PointerEvent) => {
    event.preventDefault();
    if(cursor == null || cursorState.mode !== CursorMode.ReactionSelector){
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({ cursor: {x,y} });
    }
    
  }, [])

  const handlePointerLeave = useCallback( (event: React.PointerEvent) => {
    setCursorState({mode: CursorMode.Hidden})
    updateMyPresence({ cursor: null, message: null })
  }, [])

  const handlePointerDown = useCallback( (event: React.PointerEvent) => {
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
    updateMyPresence({ cursor: {x,y} })

    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state);
  }, [cursorState.mode, setCursorState])

  const handlePointerUp = useCallback((event: React.PointerEvent)=>{
    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state);
  },[cursorState.mode, setCursorState])

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if(e.key === '/'){
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: '',
        })
      }else if(e.key === 'Escape') {
        updateMyPresence({message:''})
        setCursorState({mode: CursorMode.Hidden})
      }else if(e.key === 'e') {
        setCursorState({mode: CursorMode.ReactionSelector,})
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if(e.key === '/') {
        e.preventDefault();
      }
      if(e.key === 'Escape') {
        e.preventDefault();
      }
      if(e.key === 'e') {
        e.preventDefault();
      }
    }
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown',onKeyDown);
    }
  },[updateMyPresence]);



  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="h-[100vh] w-full flex justify-center items-center text-center"
    >
        <h1 className="text-2xl text-white">
        Arpit
        </h1>
        {reactions.map((r)=> (
          <FlyingReaction 
            key={r.timestamp.toString()}
            x={r.point.x}
            y={r.point.y}
            timestamp={r.timestamp}
            value={r.value}
          />
        ))}
        {cursor && (
          <CursorChat 
            cursor={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
          />
        )}

        {cursorState.mode === CursorMode.ReactionSelector && (
          <ReactionSelector 
            setReaction={(reaction) => {setReaction(reaction)}}
          />
        )}
        <LiveCursors others={others} />
    </div>
  )
}

export default Live