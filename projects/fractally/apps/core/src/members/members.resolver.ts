import { NotFoundException } from "@nestjs/common";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";

import { SubchainService } from "../subchain/subchain.service";
import { Member } from "./models/member.model";

@Resolver((of) => Member)
export class MembersResolver {
    constructor(private readonly subchain: SubchainService) {}

    @Query((returns) => Member)
    member(@Args("account") account: string): Member {
        const result = this.subchain.storage.query(
            `{members(ge:"${account}", le:"${account}") 
            ${this.membersQueryFields}}`
        );
        const member = result.data?.members.edges[0]?.node;
        if (!member) {
            throw new NotFoundException(account);
        }
        return this.convertEosRawMember(member);
    }

    @Query((returns) => [Member])
    members(
        @Args("pageSize", { type: () => Int }) pageSize: number,
        @Args("beforeCursor", { nullable: true }) beforeCursor?: string,
        @Args("afterCursor", { nullable: true }) afterCursor?: string
    ): Member[] {
        const result = beforeCursor
            ? this.subchain.storage.query(
                  `{members(last:${pageSize}, before:"${beforeCursor}")
                ${this.membersQueryFields}}`
              )
            : this.subchain.storage.query(
                  `{members(first:${pageSize}, after:"${afterCursor || ""}")
                ${this.membersQueryFields}}`
              );
        return (
            result.data?.members.edges.map((item) =>
                this.convertEosRawMember(item.node)
            ) || []
        );
    }

    membersQueryFields = `{
            edges {
                node {
                    account
                    balance {
                        amount
                    }
                    profile {
                        name
                        img
                        bio
                        social
                        attributions
                    }
                }
            }
        }`;

    private convertEosRawMember(eosRawMember: any): Member {
        const member = new Member();
        member.account = eosRawMember.account;
        member.balance = eosRawMember.balance.amount;
        member.name = eosRawMember.profile.name;
        member.img = eosRawMember.profile.img;
        member.bio = eosRawMember.profile.bio;
        member.social = JSON.stringify(eosRawMember.profile.social) as any;
        member.attributions = eosRawMember.profile.attributions;
        return member;
    }
}
