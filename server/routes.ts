import { Filter, ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Event, LocationResource, Opinion, Poll, Post, RadiusResource, User, WebSession } from "./app";
import { BadValuesError } from "./concepts/errors";
import { EventDoc } from "./concepts/event";
import { PostDoc, PostOptions } from "./concepts/post";
import { PollDoc } from "./concepts/poll"
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.get("/users/:userId")
  async getUserById(userId: ObjectId) {
    return await User.getUserById(userId);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts/:author")
  async getPostsByAuthor(author: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.get("/posts/:project") 
  async getPostsByProject(project: ObjectId) {
    const posts = await Post.getPosts({project: project});
    return posts;
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, project: ObjectId, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, project, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.post("/radiusResources")
  async createRadiusResource(
    session: WebSessionDoc,
    longitude: string,
    latitude: string,
    radius: string,
    name: string,
    status: string,
    content: string,
    criticalDates: [{ info: string; time: string }],
  ) {
    await RadiusResource.validNums(longitude, latitude, radius);
    const long = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const rad = parseFloat(radius);
    return await RadiusResource.createRadiusResource(long, lat, rad, name, status, content, criticalDates);
  }

  @Router.get("/radiusResources")
  async getRadiusResources(session: WebSessionDoc, longitude: string, latitude: string) {
    const long = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const location = { longitude: long, latitude: lat };
    const resources = await RadiusResource.getAllResourceAtLocation(location);
    return resources;
  }

  @Router.get("/radiusResources/:_id")
  async getRadiusResourceById(_id: ObjectId) {
    return await RadiusResource.getRadiusResourceById(_id);
  }

  @Router.delete("/radiusResources/:_id")
  async deleteRadiusResourceById(_id: ObjectId) {
    return await RadiusResource.deleteRadiusResourceById(_id);
  }

  @Router.patch("/radiusResources/:_id/location")
  async changeLocation(_id: ObjectId, longitude: string, latitude: string) {
    await RadiusResource.validNums(longitude, latitude, "0");
    const long = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const location = { longitude: long, latitude: lat };
    return await RadiusResource.changeLocation(_id, location);
  }

  @Router.patch("/radiusResources/:_id/status")
  async changeStatus(_id: ObjectId, status: string) {
    return await RadiusResource.changeStatus(_id, status);
  }

  @Router.patch("/radiusResources/:_id/description")
  async changeDescription(_id: ObjectId, content: string) {
    return await RadiusResource.changeDescription(_id, content);
  }

  @Router.patch("/radiusResources/:_id/criticalDates")
  async changeCriticalDate(_id: ObjectId, criticalDates: [{ info: string; time: string }]) {
    // do a little check on the critical dates to see if there are no invalid things
    await RadiusResource.validCriticalDates(criticalDates);

    // convert the time to an actual datetime object
    const _criticalDates = criticalDates.map((criticalDates) => {
      return { info: criticalDates.info, time: new Date(criticalDates.time) };
    });

    return await RadiusResource.changeCriticalDate(_id, _criticalDates);
  }

  @Router.post("/locationResources")
  async createLocationResource(name: string, description: string, start: Date, status: string, longitude: string, latitude: string) {
    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const locationResource = await LocationResource.create(name, description, start, status, lng, lat);
    return;
  }

  @Router.get("/locationResources")
  async getLocationResource(longitude: string, latitude: string, radius: string) {
    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const rad = parseFloat(radius);
    const locationResources = await LocationResource.getWithinRadius(lng, lat, rad);
    return locationResources;
  }

  @Router.get("/locationResources/:_id")
  async getLocationResourceById(_id: ObjectId) {
    const locationResource = await LocationResource.getById(_id);
    return locationResource;
  }

  @Router.delete("/locationResources/:_id")
  async deleteLocationResource(_id: ObjectId) {
    const msg = await LocationResource.delete(_id);
    return msg;
  }

  @Router.patch("/locationResources/:_id/location")
  async updateLocationResourceLocation(_id: ObjectId, longitude: string, latitude: string) {
    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const msg = await LocationResource.update(_id, { location: { type: "Point", coordinates: [lng, lat] } });
    return msg;
  }

  @Router.patch("/locationResources/:_id/status")
  async updateLocationResourceStatus(_id: ObjectId, status: string) {
    const msg = await LocationResource.update(_id, { status });
    return msg;
  }

  @Router.patch("/locationResources/:_id/description")
  async updateLocationResourceDescription(_id: ObjectId, description: string) {
    const msg = await LocationResource.update(_id, { description });
    return msg;
  }

  @Router.post("/opinions")
  async createOpinion(session: WebSessionDoc, content: string, feeling: string, root: ObjectId) {
    const feels = parseFloat(feeling);
    const author = WebSession.getUser(session);
    return await Opinion.createOpinion(author, content, feels, root);
  }

  @Router.get("/opinions")
  async getOpinions(author?: ObjectId, root?: ObjectId) {
    let opinions;
    let feelings;
    if (author) {
      opinions = (await Opinion.getOpinions({ author: author })).opinions;
      feelings = (await Opinion.getOpinions({ author: author })).feelings;
    } else if (root) {
      opinions = (await Opinion.getOpinions({ root: root })).opinions;
      feelings = (await Opinion.getOpinions({ root: root })).feelings;
    }
    console.log("opinions", opinions);
    console.log("feelings", feelings);
    if (opinions) {
      const namedOpinions: any = [];
      for (const opinion of opinions) {
        const newOpinion = { ...opinion, author: (await User.getUserById(opinion.author)).username };
        namedOpinions.push(newOpinion);
      }
      console.log("namedOpinions", namedOpinions);
      return { opinions: namedOpinions, feelings: feelings };
    } else {
      throw new Error("no opinions");
    }
  }

  @Router.delete("/opinions/:_id")
  async deleteOpinion(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Opinion.isAuthor(user, _id);
    return Opinion.delete(_id);
  }

  @Router.post("/events")
  async createEvent(session: WebSessionDoc, name: string, type: string, date: string, root: ObjectId, location?: Array<number>) {
    const author = WebSession.getUser(session);

    // a small check to see if the date is a valid date
    const dateObj = new Date(date);
    if (isNaN(dateObj.getDate())) {
      throw new BadValuesError("The resulting date string is not valid");
    }

    return await Event.createEvent(name, type, author, dateObj, root, location);
  }

  @Router.delete("/events/:_id")
  async deleteEvent(_id: ObjectId) {
    return await Event.deleteEvent(_id);
  }

  @Router.patch("/events/:_id")
  async updateEvent(_id: ObjectId, update: Partial<EventDoc>) {
    return await Event.modifyEvent(_id, update);
  }

  @Router.post("/event/:_id")
  async registerUser(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Event.registerUser(_id, user);
  }

  @Router.delete("/event/:_id")
  async deregisterUser(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Event.deregisterUser(_id, user);
  }

  @Router.get("/events")
  async getEvents(query: Filter<EventDoc>) {
    const events = await Event.getEvents(query);
    return await Event.getEvents(query);
  }

  @Router.post("/polls")
  async createPoll(session: WebSessionDoc, prompt: string, options: string[], root: ObjectId) {
    const user = WebSession.getUser(session);
    return await Poll.create(prompt, options, user, root);
  }

  @Router.patch("/polls/:_id")
  async updatePoll(session: WebSessionDoc, _id: ObjectId, update: Partial<PollDoc>) {
    const user = WebSession.getUser(session);
    await Poll.isAuthor(user, _id);
    return await Poll.update(_id, update);
  }

  @Router.delete("/polls/:_id")
  async deletePoll(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Poll.isAuthor(user, _id);
    return Poll.delete(_id);
  }

  @Router.get("/polls/:author")
  async getPollsByAuthor(author: string) {
    let polls;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      polls = await Poll.getPolls({author: id});
    } else {
      polls = await Poll.getPolls({});
    }
    return polls;
  }

  @Router.get("/polls/:root") 
  async getPollsByRoot(root: ObjectId) {
    const polls = await Poll.getPolls({project: root});
    return polls;
  }

  @Router.patch("polls/add/:_id")
  async addVote(session: WebSessionDoc, _id: ObjectId, choice: string) {
    const user = WebSession.getUser(session);
    await Poll.addVote(_id, user, choice);
  }

  @Router.patch("polls/remove/:_id")
  async removeVote(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Poll.removeVote(_id, user);
  }

}

export default getExpressRouter(new Routes());
