import React from "react";
import NextLink from "next/link";

const LinkWrap = ({ children, refAs, ...props }, ref) => {
    if (refAs) {
        props[refAs] = ref;
    }
    return (
        <>
            {React.isValidElement(children)
                ? React.cloneElement(children, props)
                : null}
        </>
    );
};

const LinkWrapper = React.forwardRef(LinkWrap);

interface Props {
    refAs?: any;
    children: any;
    href: string | undefined;
}

export const Link = ({ refAs, children, ...props }: Props) => {
    return (
        <NextLink {...props}>
            <LinkWrapper refAs={refAs}>{children}</LinkWrapper>
        </NextLink>
    );
};
