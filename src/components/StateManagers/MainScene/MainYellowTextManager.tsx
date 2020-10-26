import React, { useCallback, useEffect } from "react";
import blue_orb_huds from "../../../resources/blue_orb_huds.json";
import site_a from "../../../resources/site_a.json";
import { useTextRendererStore } from "../../../store";
import blue_orb_directions from "../../../resources/blue_orb_directions.json";

type AnimateYellowTextWithMove = (
  yellowLetterPosYOffset: number,
  targetBlueOrbHudId: string,
  targetBlueOrbId: string
) => void;

type AnimateYellowTextWithoutMove = (
  targetBlueOrbHudId: string,
  targetBlueOrbId: string
) => void;

type YellowTextDispatchData = {
  action: AnimateYellowTextWithMove | AnimateYellowTextWithoutMove;
  value: any;
};

type YellowTextDispatcher = {
  move_up: YellowTextDispatchData;
  move_down: YellowTextDispatchData;
  move_left: YellowTextDispatchData;
  move_right: YellowTextDispatchData;
  change_blue_orb: YellowTextDispatchData;
};

const MainYellowTextManager = (props: any) => {
  const setYellowText = useTextRendererStore((state) => state.setYellowText);

  const setYellowTextOffsetXCoeff = useTextRendererStore(
    (state) => state.setYellowTextOffsetXCoeff
  );

  const incrementYellowTextPosY = useTextRendererStore(
    (state) => state.incrementYellowTextPosY
  );
  const setYellowTextPosY = useTextRendererStore(
    (state) => state.setYellowTextPosY
  );
  const setYellowTextPosX = useTextRendererStore(
    (state) => state.setYellowTextPosX
  );

  const animateYellowTextWithMove: AnimateYellowTextWithMove = useCallback(
    (
      yellowLetterPosYOffset: number,
      targetBlueOrbHudId: string,
      targetBlueOrbId: string
    ) => {
      // animate the letters to match that of site's
      // to create an illusion of not moving
      setTimeout(() => {
        incrementYellowTextPosY(yellowLetterPosYOffset);
      }, 1300);

      setTimeout(() => {
        // make current hud big text shrink
        setYellowTextOffsetXCoeff(-1);
      }, 2500);

      setTimeout(() => {
        // animate it to new pos x/y
        setYellowTextPosX(
          blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[0]
        );
        setYellowTextPosY(
          blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[1]
        );
        // set new text according to the node name
        setYellowText(site_a[targetBlueOrbId as keyof typeof site_a].node_name);
      }, 3000);

      // unshrink text
      setTimeout(() => {
        setYellowTextOffsetXCoeff(0);
      }, 3900);
    },
    [
      incrementYellowTextPosY,
      setYellowText,
      setYellowTextOffsetXCoeff,
      setYellowTextPosX,
      setYellowTextPosY,
    ]
  );

  const animateYellowTextWithoutMove: AnimateYellowTextWithoutMove = useCallback(
    (targetBlueOrbHudId: string, targetBlueOrbId: string) => {
      // make current hud big text shrink
      setYellowTextOffsetXCoeff(-1);

      setTimeout(() => {
        setYellowTextPosX(
          blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[0]
        );
        setYellowTextPosY(
          blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[1]
        );
      }, 400);
      // animate it to new pos x/y

      setTimeout(() => {
        // set new text according to the node name
        setYellowText(site_a[targetBlueOrbId as keyof typeof site_a].node_name);
      }, 1000);

      setTimeout(() => {
        // unshrink text
        setYellowTextOffsetXCoeff(0);
      }, 1200);
    },
    [
      setYellowText,
      setYellowTextOffsetXCoeff,
      setYellowTextPosX,
      setYellowTextPosY,
    ]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      targetBlueOrbHudId: string | undefined,
      targetBlueOrbId: string | undefined
    ) => {
      const dispatcherObjects: YellowTextDispatcher = {
        move_up: {
          action: animateYellowTextWithMove,
          value: [-1.5, targetBlueOrbHudId, targetBlueOrbId],
        },
        move_down: {
          action: animateYellowTextWithMove,
          value: [1.5, targetBlueOrbHudId, targetBlueOrbId],
        },
        move_left: {
          action: animateYellowTextWithMove,
          value: [targetBlueOrbHudId, targetBlueOrbId],
        },
        move_right: {
          action: animateYellowTextWithMove,
          value: [targetBlueOrbHudId, targetBlueOrbId],
        },
        change_blue_orb: {
          action: animateYellowTextWithoutMove,
          value: [targetBlueOrbHudId, targetBlueOrbId],
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [animateYellowTextWithMove, animateYellowTextWithoutMove]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject =
        blue_orb_directions[
          props.eventState as keyof typeof blue_orb_directions
        ];

      if (eventObject) {
        const eventAction = eventObject.action;

        const targetBlueOrbId = eventObject.target_blue_orb_id;
        const targetBlueOrbHudId = eventObject.target_hud_id;

        const dispatchedObject = dispatchObject(
          eventAction,
          targetBlueOrbHudId,
          targetBlueOrbId
        );

        if (dispatchedObject) {
          (dispatchedObject.action as any).apply(null, dispatchedObject.value);
        }
      } else {
      }
    }
  }, [
    animateYellowTextWithMove,
    animateYellowTextWithoutMove,
    props.eventState,
    props.targetBlueOrbHudId,
    props.targetBlueOrbId,
    dispatchObject,
  ]);

  return null;
};

export default MainYellowTextManager;