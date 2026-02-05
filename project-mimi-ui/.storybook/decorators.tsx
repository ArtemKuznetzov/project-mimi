import type { Decorator } from "@storybook/react";
import { Provider } from "react-redux";
import { createStore } from "@/app/store";

export const withRedux: Decorator = (Story) => {
  const store = createStore();

  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};
