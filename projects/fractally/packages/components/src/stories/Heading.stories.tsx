import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Heading } from "../ui/Heading";

export default {
    component: Heading,
} as ComponentMeta<typeof Heading>;

const Template: ComponentStory<typeof Heading> = (args) => (
    <Heading {...args} />
);

export const Default = Template.bind({});
Default.args = {
    children: "Default Heading (H1)",
};

export const Heading2 = Template.bind({});
Heading2.args = {
    size: 2,
    children: "Heading level 2 (H2)",
};

export const Heading3 = Template.bind({});
Heading3.args = {
    size: 3,
    children: "Heading level 3 (H3)",
};
