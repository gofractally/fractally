import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import SendDialog from "../ui/SendDialog";

export default {
    component: SendDialog,
} as ComponentMeta<typeof SendDialog>;

const Template: ComponentStory<typeof SendDialog> = (args) => {
    return (
        <div className="max-w-lg">
            <SendDialog />
        </div>
    );
};

export const Default = Template.bind({});
