import {CategoryId, CategoryModeratorView, GetSiteResponse, MyUserInfo, PersonView,} from "lemmy-js-client";

export function amAdmin(myUserInfo?: MyUserInfo): boolean {
  return myUserInfo?.localUserView.localUser.admin ?? false;
}

export function amCategoryCreator(
  creatorId: number,
  mods?: CategoryModeratorView[],
  myUserInfo?: MyUserInfo,
): boolean {
  const myId = myUserInfo?.localUserView.person.id;
  // Don't allow mod actions on yourself
  return myId === mods?.at(0)?.moderator.id && myId !== creatorId;
}

export function amMod(
  categoryId: CategoryId,
  myUserInfo?: MyUserInfo,
): boolean {
  // MyUserInfo in our client does not include a list of moderated categories.
  // Until this data is wired, only admins are considered as having mod privileges site-wide.
  return amAdmin(myUserInfo);
}

export function amSiteCreator(
  creator_id: number,
  admins?: PersonView[],
  myUserInfo?: MyUserInfo,
): boolean {
  const myId = myUserInfo?.localUserView.person.id;
  return myId === admins?.at(0)?.person.id && myId !== creator_id;
}

export function amTopMod(
  mods: CategoryModeratorView[],
  myUserInfo?: MyUserInfo,
): boolean {
  return mods.at(0)?.moderator.id === myUserInfo?.localUserView.person.id;
}

export function canAdmin(
  creatorId: number,
  admins?: PersonView[],
  myUserInfo?: MyUserInfo,
  onSelf = false,
): boolean {
  return canMod(creatorId,
    undefined,
    admins,
    myUserInfo,
    onSelf);
}

export function moderatesSomething(myUserInfo?: MyUserInfo): boolean {
  // Our MyUserInfo type does not expose a moderated categories list.
  // Treat only admins as moderators until user moderates are provided elsewhere.
  return amAdmin(myUserInfo);
}

export function canCreateCategory(
  siteRes: GetSiteResponse,
  myUserInfo?: MyUserInfo,
): boolean {
  const adminOnly = siteRes.siteView.localSite.categoryCreationAdminOnly;
  // TODO: Make this check if profile is logged on as well
  return !adminOnly || amAdmin(myUserInfo);
}

// TODO get rid of this, as its in the back-end now
export function canMod(
  creator_id: number,
  mods?: CategoryModeratorView[],
  admins?: PersonView[],
  myUserInfo?: MyUserInfo,
  onSelf = false,
): boolean {
  // You can do moderator actions only on the mods added after you.
  let adminsThenMods =
    admins
    ?.map(a => a.person.id)
    .concat(mods?.map(m => m.moderator.id) ?? []) ?? [];

  if (myUserInfo) {
    const myIndex = adminsThenMods.findIndex(
      id => id === myUserInfo.localUserView.person.id,
    );
    if (myIndex === -1) {
      return false;
    } else {
      // onSelf +1 on mod actions not for yourself, IE ban, remove, etc
      adminsThenMods = adminsThenMods.slice(0,
        myIndex + (onSelf ? 0 : 1));
      return !adminsThenMods.includes(creator_id);
    }
  } else {
    return false;
  }
}
