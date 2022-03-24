import React, { KeyboardEventHandler, MouseEventHandler } from "react";

import Avatar, { AvatarStatusBadge } from "./Avatar";

export interface ListProps {
    children: React.ReactNode;
}

export const List = ({ children }: ListProps) => {
    return <ul className="w-full">{children}</ul>;
};

export interface ListItemProps {
    onItemClick?: MouseEventHandler<HTMLLIElement>;
    onItemKeyDown?: KeyboardEventHandler<HTMLLIElement>;
    children: React.ReactNode;
}

export const ListItem = ({
    children,
    onItemClick,
    onItemKeyDown,
}: ListItemProps) => {
    const listItemClass =
        "flex items-center p-4 outline-none bg-white my-0.5 cursor-pointer hover:bg-gray-50 active:bg-gray-50";
    return (
        <li
            className={listItemClass}
            tabIndex={0}
            onClick={onItemClick}
            onKeyDown={onItemKeyDown}
        >
            {children}
        </li>
    );
};

export interface ListItemTextProps {
    children: React.ReactNode;
    isBold?: boolean;
    isSecondary?: boolean;
}

export const ListItemText = ({
    children,
    isBold,
    isSecondary,
}: ListItemTextProps) => {
    const boldClass = isBold ? "font-semibold" : "";
    const textClass = isSecondary
        ? `mt-2 text-xs text-gray-600`
        : `text-base first-letter:uppercase`;
    const componentClass = `${textClass} ${boldClass}`;
    return (
        <div className="flex flex-col">
            <div className={componentClass}>{children}</div>
        </div>
    );
};

export interface ListItemAvatarProps {
    avatarUrl: string;
    statusBadge?: AvatarStatusBadge;
}

export const ListItemAvatar = ({
    avatarUrl,
    statusBadge,
}: ListItemAvatarProps) => {
    return (
        <div className="flex mr-2.5">
            <Avatar
                size="md"
                shape="hex"
                avatarUrl={avatarUrl}
                statusBadge={statusBadge}
            />
        </div>
    );
};
