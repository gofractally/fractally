import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "member " })
export class Member {
    @Field()
    account: string;

    @Field()
    balance: string;

    @Field()
    name: string;

    @Field()
    img: string;

    @Field()
    bio: string;

    @Field()
    social: string;

    @Field()
    attributions: string;
}
