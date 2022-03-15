import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Glyph } from "../ui/Glyph";
import { FaDollarSign, FaYinYang } from "react-icons/fa";

export default {
    component: Glyph,
} as ComponentMeta<typeof Glyph>;

const Template: ComponentStory<typeof Glyph> = (args) => <Glyph {...args} />;

export const Default = Template.bind({});
Default.args = {
    chars: "ℝ",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
    Icon: FaYinYang,
};

export const Static = Template.bind({});
Static.args = {
    Icon: FaDollarSign,
    isStatic: true,
    isOutline: true,
    size: "xl",
};
