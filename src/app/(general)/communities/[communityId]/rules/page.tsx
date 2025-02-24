import Button from "@/features/common/components/Button";
import Rule from "@/features/rules/components/Rule";
import RuleForm from "@/features/rules/components/RuleForm";
import { deleteRule } from "@/lib/actions";
import getCommunity from "@/lib/getCommunity";
import withModeratorAuth from "@/lib/withModeratorAuth";

type Params = {
    params: Promise<{
        communityId: string;
    }>
}

export default async function Rules({ params }: Params) {
    const communityId = Number.parseInt((await params).communityId);
    const community = await getCommunity(communityId);
    await withModeratorAuth(communityId);
    return (
        <div className="pt-4 mt-4 border-t-[1px] border-secondary">
            <h2 className="text-lg font-semibold">
                Community Rules
            </h2>
            <div className="space-y-2">
            {
                community.rules.map((rule: Rule) => {
                    return (
                        <div key={rule.id} className="flex items-start gap-2">
                            <div className="flex-1">
                                <Rule {...rule} />
                            </div>
                            <form action={async () => {
                                "use server"
                                await deleteRule(rule.id);
                            }}>
                                <Button className="text-sm mt-2 px-2 py-1 m-0">
                                    Delete
                                </Button>
                            </form>
                        </div>
                    )
                })
            }
            </div>
            <div className="mt-6">
                <RuleForm communityId={community.id} />
            </div>
        </div>
    )
}