import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import ConfirmSendDialog from "../ui/ConfirmSendDialog";

export default {
    component: ConfirmSendDialog,
} as ComponentMeta<typeof ConfirmSendDialog>;

const Template: ComponentStory<typeof ConfirmSendDialog> = (args) => {
    return (
        <div className="max-w-lg">
            <ConfirmSendDialog />
        </div>
    );
};

export const Default = Template.bind({});
