import React, { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventManager";
import { useMediaStore } from "../../../store";

const MediaComponentManager = (props: StateManagerProps) => {
  const setActiveMediaComponent = useMediaStore(
    (state) => state.setActiveMediaComponent
  );

  const setLastActiveLeftSideElement = useMediaStore(
    (state) => state.setLastActiveLeftSideElement
  );
  const lastActiveLeftSideElement = useMediaStore(
    (state) => state.lastActiveLeftSideElement
  );
  const setLastActiveRightSideElement = useMediaStore(
    (state) => state.setLastActiveRightSideElement
  );
  const lastActiveRightSideElement = useMediaStore(
    (state) => state.lastActiveRightSideElement
  );

  const switchToLeftSide = useCallback(
    (from: string) => {
      setActiveMediaComponent(lastActiveLeftSideElement);
      // store last active right side elem
      setLastActiveRightSideElement(from);
    },
    [
      lastActiveLeftSideElement,
      setActiveMediaComponent,
      setLastActiveRightSideElement,
    ]
  );

  const switchToRightSide = useCallback(
    (from: string) => {
      setActiveMediaComponent(lastActiveRightSideElement);
      // store last active left side elem
      setLastActiveLeftSideElement(from);
    },
    [
      lastActiveRightSideElement,
      setActiveMediaComponent,
      setLastActiveLeftSideElement,
    ]
  );

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        play_down: { action: setActiveMediaComponent, value: "exit" },
        exit_up: { action: setActiveMediaComponent, value: "play" },
        play_right: {
          action: switchToRightSide,
          value: "play",
        },
        exit_right: {
          action: switchToRightSide,
          value: "exit",
        },
        fstWord_left: {
          action: switchToLeftSide,
          value: "fstWord",
        },
        fstWord_up: {
          action: setActiveMediaComponent,
          value: "thirdWord"
        },
        fstWord_down: {
          action: setActiveMediaComponent,
          value: "sndWord",
        },
        sndWord_up: {
          action: setActiveMediaComponent,
          value: "fstWord",
        },
        sndWord_down: {
          action: setActiveMediaComponent,
          value: "thirdWord",
        },
        sndWord_left: {
          action: switchToLeftSide,
          value: "sndWord"
        },
        thirdWord_down: {
          action: setActiveMediaComponent,
          value: "fstWord",
        },
        thirdWord_up: {
          action: setActiveMediaComponent,
          value: "sndWord",
        },
        thirdWord_left: {
          action: switchToLeftSide,
          value: "thirdWord"
        }
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setActiveMediaComponent, switchToLeftSide, switchToRightSide]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaComponentManager;