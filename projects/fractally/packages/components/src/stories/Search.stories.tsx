import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Search } from "../ui/Search";

export default {
    component: Search,
} as ComponentMeta<typeof Search>;

const Template: ComponentStory<typeof Search> = (args) => {
    const [value, setValue] = useState<string>(`${args.value || ""}`);

    return (
        <div className="w-80">
            <Search
                onChange={(newValue) => setValue(newValue)}
                value={value}
                {...args}
            />
        </div>
    );
};

export const Default = Template.bind({});

export const WithValue = Template.bind({ value: "Fractals" });
