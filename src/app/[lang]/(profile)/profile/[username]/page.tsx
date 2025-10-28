import {HttpService} from "@/services";
import {REQUEST_STATE} from "@/services/HttpService";
import CurrentProfileUser from "@/app/[lang]/(profile)/profile/components/CurrentProfileUser";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ username: string }>;
}) {
    const resolvedParams = await params;

    const res = await HttpService.client.visitProfile(resolvedParams.username)

    return <CurrentProfileUser profile={res.state === REQUEST_STATE.SUCCESS ? res?.data.profile : null}/>;
}
