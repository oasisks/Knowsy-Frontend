import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface EventDoc extends BaseDoc {
  name: string;
  type: string;
  author: ObjectId;
  date: Date;
  root: ObjectId;
  location?: Array<number>;
  attendees: Array<ObjectId>;
}

export default class EventConcept {
  public readonly events = new DocCollection<EventDoc>("events");

  async createEvent(name: string, type: string, author: ObjectId, date: Date, root: ObjectId, location?: Array<number>) {
    const attendees: Array<ObjectId> = [];
    const _id = await this.events.createOne({ name, type, author, date, root, location, attendees });
    return { msg: "Event successfully created!", event: await this.events.readOne({ _id }) };
  }

  async deleteEvent(_id: ObjectId) {
    await this.events.deleteOne({ _id });
    return { msg: "Event deleted successfully!" };
  }

  async modifyEvent(_id: ObjectId, update: Partial<EventDoc>) {
    this.sanitizeUpdate(update);
    await this.events.updateOne({ _id }, update);
    return { msg: "Event successfully modified!" };
  }

  private sanitizeUpdate(update: Partial<EventDoc>) {
    // Make sure the update cannot change the author.
    const allowedUpdates = ["name", "type", "date", "location", "attendees"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }

  async registerUser(_id: ObjectId, user: ObjectId) {
    const members = (await this.events.readOne({ _id }))?.attendees;
    if (members) {
      members.push(user);
      const update: Partial<EventDoc> = { attendees: members };
      await this.modifyEvent(_id, update);
      return { msg: "User successfully registered!" };
    } else {
      throw new NotFoundError(`Event ${_id} not found!`);
    }
  }

  async deregisterUser(_id: ObjectId, user: ObjectId) {
    const members = (await this.events.readOne({ _id }))?.attendees;
    if (members) {
      const newMembers = members.filter((member) => member !== user);
      // newMembers is a list of people without user
      const update: Partial<EventDoc> = { attendees: newMembers };
      await this.modifyEvent(_id, update);
      return { msg: "User successfully deregistered!" };
    } else {
      throw new NotFoundError(`Event ${_id} not found!`);
    }
  }

  async getEvents(query: Filter<EventDoc>) {
    const events = await this.events.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return events;
  }
}

// export class OpinionAuthorNotMatchError extends NotAllowedError {
//   constructor(
//     public readonly author: ObjectId,
//     public readonly _id: ObjectId,
//   ) {
//     super("{0} is not the author of Opinion {1}!", author, _id);
//   }
// }
