import { useStore } from "../../../store";

const idleManager = (eventState: any) => {
  const setIdleScene = useStore.getState().setIdleScene;

  const dispatchAction = (eventState: {
    media: string;
    images: { "1": string; "2": string; "3": string } | undefined;
    nodeName: string | undefined;
  }) => ({ action: () => setIdleScene(eventState) });

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default idleManager;