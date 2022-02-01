import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Countdown } from "../ui/Countdown";

export default {
    component: Countdown,
} as ComponentMeta<typeof Countdown>;

const Template: ComponentStory<typeof Countdown> = (args) => (
    <Countdown {...args} />
);

export const Default = Template.bind({});
Default.args = {
    endTime: new Date(Date.now() + 60 * 1000),
};
