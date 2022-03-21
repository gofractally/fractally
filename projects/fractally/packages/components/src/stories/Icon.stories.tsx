import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Icon } from "../ui/Icon";

export default {
    component: Icon,
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => (
    <div className="w-80">
        <Icon {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    type: "coffee",
    size: "sm",
};
