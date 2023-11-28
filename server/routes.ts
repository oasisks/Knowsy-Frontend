import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { LocationResource, Opinion, Post, RadiusResource, User, WebSession } from "./app";
import { PostDoc, PostOptions } from "./concepts/post";
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

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
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
    return await RadiusResource.createRadiusBasedResource(long, lat, rad, name, status, content, criticalDates);
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
  async createLocationResource(name: string, description: string, start: Date, status: string, longitude: number, latitude: number) {
    const locationResource = await LocationResource.create(name, description, start, status, longitude, latitude);
    
    return;
  }

  @Router.get("/locationResources")
  async getLocationResource(longitude: number, latitude: number, radius: number) {
    const locationResources = await LocationResource.getWithinRadius(longitude, latitude, radius);
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
  async updateLocationResourceLocation(_id: ObjectId, longitude: number, latitude: number) {
    const msg = await LocationResource.update(_id, {location: { type: "Point", coordinates: [longitude, latitude] }});
    return msg;
  }

  @Router.patch("/locationResources/:_id/status")
  async updateLocationResourceStatus(_id: ObjectId, status: string) {
    const msg = await LocationResource.update(_id, {status});
    return msg;
  }

  @Router.patch("/locationResources/:_id/description")
  async updateLocationResourceDescription(_id: ObjectId, description: string) {
    const msg = await LocationResource.update(_id, {description});
    return msg;
  }




  @Router.post("/posts/:_id/opinions")
  async createOpinion(author: ObjectId, content: string, feeling: Number, root: ObjectId) {
    return await Opinion.createOpinion(author, content, feeling, root);
  }

  @Router.get("/opinions")
  async getOpinions(author?: ObjectId, root?: ObjectId) {
    let opinions;
    if (author) {
      opinions = await Opinion.getOpinions(author);
    } else if (root) {
      opinions = await Opinion.getOpinions(root);
    } else {
      opinions = await Post.getPosts({});
    }
    return opinions;
  }

  @Router.delete("/opinions/:_id")
  async deleteOpinion(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Opinion.isAuthor(user, _id);
    return Opinion.delete(_id);
  }
}

export default getExpressRouter(new Routes());
