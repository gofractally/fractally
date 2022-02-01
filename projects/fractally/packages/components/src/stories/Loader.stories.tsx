import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Loader } from "../ui/Loader";

export default {
    component: Loader,
} as ComponentMeta<typeof Loader>;

const Template: ComponentStory<typeof Loader> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
