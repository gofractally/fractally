export enum ActionType {
    ShowDummyModal = "SHOW_DUMMY_MODAL",
}

/**
 * Dummy Modal Example
 * @param {boolean} isOpen - controls open/close state of modal
 * @param {(value: unknown) => void} resolver - A promise resolver that is resolved when modal is dismissed
 * @returns a reducer action
 */
export const actionShowDummyModal = (
    isOpen: boolean,
    resolver: ((value: string) => void) | null
) => ({
    type: ActionType.ShowDummyModal,
    payload: { isOpen, resolver },
});
