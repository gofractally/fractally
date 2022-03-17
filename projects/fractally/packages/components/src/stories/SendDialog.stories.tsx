import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import SendDialog from "../ui/SendDialog";

export default {
    component: SendDialog,
} as ComponentMeta<typeof SendDialog>;

const Template: ComponentStory<typeof SendDialog> = (args) => {
    // const [isModalOpen, setModalOpen] = useState(false);
    return (
        <SendDialog />
    );
};

export const Default = Template.bind({});
Default.args = {
    className: "SendDialog",
};
