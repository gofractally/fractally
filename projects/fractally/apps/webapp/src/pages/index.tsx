import React from "react";
import { Button } from "@fractally/components/ui/Button";

import { Link } from "../app/utils";

export default () => (
    <div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <div>
            <Link href="/video">
                <Button>Video</Button>
            </Link>
            {" | "}
            <Link href="/get-token">
                <Button>Get Token</Button>
            </Link>
            {" | "}
            <Link href="/recipes">
                <Button>Recipes</Button>
            </Link>
        </div>
        Welcome!
    </div>
);
