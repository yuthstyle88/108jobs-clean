import {Coin} from "./Coin";
import {Contact} from "./Contact";
import {Address} from "./Address";
import {Card} from "./Card";

/**
 * ProfileData represents the profile's profile information.
 *
 * It contains both custom properties specific to our application and
 * properties from lemmy-js-client's LocalUser and Person types.
 *
 * Overlapping properties:
 * - profile.username ~ person.name
 * - profile.displayName ~ person.displayName
 * - profile.avatarUrl ~ person.avatar
 * - person.bio ~ person.bio
 * - contact.email ~ localUser.email
 * - profile.confirmedStatus ~ localUser.emailVerified
 */
export type ProfileData = {
  coin: Coin;
  contact: Contact;
  address: Address;
  card: Card;
  isNewBuyer: false;
};
