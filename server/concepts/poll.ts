import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface PollDoc extends BaseDoc {
  prompt: string;
  options: string[];
  //   votes: { ObjectId: string }; ?
  votes: Array<{ user: ObjectId; option: string }>;
  author: ObjectId;
  project: ObjectId;
  // TODO: should we change project to target (or smth else generic) instead?
}

export default class PollConcept {
  public readonly polls = new DocCollection<PollDoc>("polls");

  async create(prompt: string, options: string[], author: ObjectId, project: ObjectId) {
    const _id = await this.polls.createOne({ prompt, options, author, project, votes: [] });
    return { msg: "Poll successfully created!", poll: await this.polls.readOne({ _id }) };
  }

  async delete(_id: ObjectId) {
    await this.polls.deleteOne({ _id });
    return { msg: "Poll deleted successfully!" };
  }

  async getPolls(query: Filter<PollDoc>) {
    const polls = await this.polls.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return polls;
  }

  async addVote(_id: ObjectId, user: ObjectId, option: string) {
    const poll = await this.polls.readOne({ _id });
    if (poll !== null) {
      if (poll.options.includes(option)) {
        if (poll.votes.filter((vote) => vote.user === user).length !== 0) {
          await this.removeVote(_id, user);
        }
        poll.votes.push({ user, option });
        await this.polls.updateOne({ _id }, poll);
        return { msg: "Vote successfully added!" };
      } else {
        throw new NotFoundError("Option not found!");
      }
    } else {
      throw new NotFoundError("Poll not found!");
    }
  }

  async removeVote(_id: ObjectId, user: ObjectId) {
    const poll = await this.polls.readOne({ _id });
    if (poll !== null) {
      if (poll.votes.filter((vote) => vote.user === user).length > 0) {
        poll.votes = poll.votes.filter(function (obj) {
          return obj.user !== user;
        });
        await this.polls.updateOne({ _id }, poll);
        return { msg: "Vote successfully removed!" };
      } else {
        throw new NotFoundError("Vote not found!");
      }
    } else {
      throw new NotFoundError("Poll not found!");
    }
  }

  async update(_id: ObjectId, update: Partial<PollDoc>) {
    this.sanitizeUpdate(update);
    await this.polls.updateOne({ _id }, update);
    return { msg: "Poll successfully updated!" };
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const poll = await this.polls.readOne({ _id });
    if (!poll) {
      throw new NotFoundError(`Poll ${_id} does not exist!`);
    }
    if (poll.author.toString() !== user.toString()) {
      throw new PollAuthorNotMatchError(user, _id);
    }
  }

  private sanitizeUpdate(update: Partial<PollDoc>) {
    // Make sure the update cannot change the author.
    const allowedUpdates = ["votes"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}

export class PollAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of poll {1}!", author, _id);
  }
}
