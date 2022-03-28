import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import ConfirmSendDialog from "../ui/send/ConfirmSendDialog";

export default {
    component: ConfirmSendDialog,
} as ComponentMeta<typeof ConfirmSendDialog>;

const Template: ComponentStory<typeof ConfirmSendDialog> = (args) => {
    return (
        <div className="max-w-lg">
            <ConfirmSendDialog onBackClick={args.onBackClick} />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    onBackClick: () => {
        console.log("Back button click");
    },
};
