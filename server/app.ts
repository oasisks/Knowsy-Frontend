import LocationResourceConcept from "./concepts/locationresource";
import OpinionConcept from "./concepts/opinion";
import PostConcept from "./concepts/post";
import RadiusBasedResourceConcept from "./concepts/radiusBasedResource";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const LocationResource = new LocationResourceConcept();
export const RadiusResource = new RadiusBasedResourceConcept();
export const Opinion = new OpinionConcept();
