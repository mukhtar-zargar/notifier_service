import { inject, injectable } from "inversify";
import { ICacheRepository } from "../../domain/ports/caching/cache_repository_interface";
import { SubscriptionParameters } from "../../domain/ports/messaging/consumer";
import { IntegrationEventRecord } from "../../domain/ports/messaging/integration_event_record";
import { IPostProps } from "../../domain/posts/post.props";
import { ILogger, Logger } from "../../infra/logging/pino";
import { container } from "../../inversify.config";
import { PostEvents, Topics } from "../constants/messaging.constants";
import { TYPES } from "../constants/types";

@injectable()
class PostConsumer {
  protected logger: ILogger;
  protected cacheRepository: ICacheRepository;

  constructor(@inject(TYPES.CacheRepository) cacheRepository: () => ICacheRepository, @inject(TYPES.Logger) logger: Logger) {
    this.logger = logger.get();
    this.cacheRepository = cacheRepository();
  }

  onPostCreated(): SubscriptionParameters {
    return {
      topic: Topics.PostService,
      eventTypes: [PostEvents.Created],
      readFromBeginning: true,
      handles: {
        handle: async (event: IntegrationEventRecord<IPostProps>) => {
          this.logger.info(`Post created ${JSON.stringify(event.value)}`);
          // Get user player ids from this.cacheRepository
          // Notify other users except creator that post has been created
          return {
            handled: true
          };
        }
      }
    };
  }

  onPostUpdated(): SubscriptionParameters {
    return {
      topic: Topics.PostService,
      eventTypes: [PostEvents.Updated],
      readFromBeginning: true,
      handles: {
        async handle(event: IntegrationEventRecord<IPostProps>) {
          // Get user player ids from this.cacheRepository
          // Notify other users except creator that post has been created
          this.logger.info(`Post Updated ${JSON.stringify(event)}`);
          return {
            handled: true
          };
        }
      }
    };
  }
}

const postConsumer = container.resolve(PostConsumer);
export default [postConsumer.onPostCreated(), postConsumer.onPostUpdated()];
