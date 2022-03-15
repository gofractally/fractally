import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui";

export default {
    component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
    const [isModalOpen, setModalOpen] = useState(false);
    return (
        <div className="w-80">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Modal
                shouldCloseOnEsc
                shouldCloseOnOverlayClick
                ariaHideApp={false}
                isOpen={isModalOpen}
                onRequestClose={() => setModalOpen(false)}
                {...args}
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    title: "Default Modal Example",
    children: (
        <div className="space-y-3">
            <div>This is a super cool modal!</div>
            <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                consectetur debitis omnis blanditiis cum at laborum doloremque,
                nam rem nesciunt error nemo voluptatibus quos quisquam non
                recusandae asperiores, sed quas.
            </div>
            <div>Press [ESC] or click in the Overlay to close it</div>
        </div>
    ),
};
