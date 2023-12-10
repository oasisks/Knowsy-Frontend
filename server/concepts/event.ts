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

  async userInRoster(_id: ObjectId, user: ObjectId) {
    // return true if user in roster
    const members = (await this.events.readOne({ _id }))?.attendees;

    if (members) {
      for (let memberId of members) {
        console.log(memberId.toString(), user.toString(), memberId.toString() === user.toString());
        if (memberId.toString() === user.toString()) {
          console.log("DOESNT REACH");
          return true;
        }
      }
    }
    return false;
  }

  async registerUser(_id: ObjectId, user: ObjectId) {
    const registered = await this.userInRoster(_id, user);
    if (registered) {
      console.log("ERROR DETECTED");
      throw new AlreadyRegisteredError(user, _id);
    }
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
      const newMembers = members.filter((member) => member.toString() !== user.toString());
      // newMembers is a list of people without user
      const update: Partial<EventDoc> = { attendees: newMembers };
      // console.log("before",await this.events.readOne({ _id }))?.attendees);

      await this.modifyEvent(_id, update);
      // console.log("after",await this.events.readOne({ _id }))?.attendees);
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

  async getEventsByAttendee(user: ObjectId) {
    const events = await this.events.readMany(
      {},
      {
        sort: { dateUpdated: -1 },
      },
    );
    const filtered = [];
    for (let event of events) {
      if (await this.userInRoster(event._id, user)) {
        filtered.push(event);
      }
    }
    return filtered;
  }
}

export class AlreadyRegisteredError extends NotAllowedError {
  constructor(
    public readonly user: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is already registered for Event {1}!", user, _id);
  }
}
