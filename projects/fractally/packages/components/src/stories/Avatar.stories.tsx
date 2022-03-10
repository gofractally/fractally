import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Avatar } from "../ui/Avatar";

export default {
    component: Avatar,
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Rey",
    size: "md",
};

export const NoAvatarURL = Template.bind({});
NoAvatarURL.args = {
    name: "Unknown",
    size: "md",
};
