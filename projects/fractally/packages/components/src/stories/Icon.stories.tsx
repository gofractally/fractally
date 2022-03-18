import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Icon } from "../ui/Icon";

export default {
    component: Icon,
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />;

export const Default = Template.bind({});
Default.args = {
    type: "dragon",
    size: "sm",
};
