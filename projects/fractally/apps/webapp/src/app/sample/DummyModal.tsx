import { Button, Modal } from "@fractally/components/ui";
import React from "react";

import { useGlobalStore } from "../../store";
import { actionShowDummyModal } from "../../store/actions";

export const DummyModal = () => {
    const { state, dispatch } = useGlobalStore();
    const { dummyModal } = state;
    const { isOpen, resolver } = dummyModal;

    const close = () => {
        dispatch(actionShowDummyModal(false, null));
        resolver?.(false); // resolve modal with false because it was closed/canceled
    };

    const handleClick = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(actionShowDummyModal(false, null));
        resolver?.(true); // resolve modal positively
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={close}
            contentLabel="Dummy Modal Sample"
            preventScroll
            shouldCloseOnOverlayClick
            shouldCloseOnEsc
        >
            <div className="space-y-3">
                <div>This is a Dummy Modal Sample!</div>
                <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Officia saepe sit repellat ipsum, odio maiores ex iure?
                    Quasi assumenda debitis quisquam, molestiae nulla
                    voluptatum, culpa nostrum nesciunt veritatis consectetur
                    quae?
                </div>
                <Button onClick={handleClick}>I love dummy modal! 😍</Button>
                <div>Press [ESC] or the Overlay to quit modal</div>
            </div>
        </Modal>
    );
};
