import EventConcept from "./concepts/event";
import FavoriteConcept from "./concepts/favorite";
import LocationResourceConcept from "./concepts/locationresource";
import OpinionConcept from "./concepts/opinion";
import PollConcept from "./concepts/poll";
import PostConcept from "./concepts/post";
import RadiusResourceConcept from "./concepts/radiusResource";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const LocationResource = new LocationResourceConcept();
export const RadiusResource = new RadiusResourceConcept();
export const Opinion = new OpinionConcept();
export const Event = new EventConcept();
export const Poll = new PollConcept();
export const Favorite = new FavoriteConcept();
