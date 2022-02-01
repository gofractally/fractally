import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Button } from "../ui/Button";

export default {
    children: "Button",
    component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    type: "primary",
    children: "Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
    type: "secondary",
    children: "Button",
};

export const Large = Template.bind({});
Large.args = {
    size: "lg",
    children: "Button",
};

export const Small = Template.bind({});
Small.args = {
    size: "sm",
    children: "Button",
};
