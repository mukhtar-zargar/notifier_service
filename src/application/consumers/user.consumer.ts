import { inject, injectable } from "inversify";
import { ICacheRepository } from "../../domain/ports/caching/cache_repository_interface";
import { SubscriptionParameters } from "../../domain/ports/messaging/consumer";
import { IntegrationEventRecord } from "../../domain/ports/messaging/integration_event_record";
import { IUserProps } from "../../domain/users/user.props";
import { ILogger, Logger } from "../../infra/logging/pino";
import { container } from "../../inversify.config";
import { Topics, UserEvents } from "../constants/messaging.constants";
import { TYPES } from "../constants/types";

@injectable()
class UserConsumer {
  protected logger: ILogger;
  protected cacheRepository: ICacheRepository;

  constructor(@inject(TYPES.CacheRepository) cacheRepository: () => ICacheRepository, @inject(TYPES.Logger) logger: Logger) {
    this.logger = logger.get();
    this.cacheRepository = cacheRepository();
  }

  onUserSignup(): SubscriptionParameters {
    return {
      topic: Topics.UserService,
      eventTypes: [UserEvents.Signup],
      readFromBeginning: true,
      handles: {
        handle: async (event: IntegrationEventRecord<IUserProps>) => {
          this.logger.info(`User Signed Up ${JSON.stringify(event.value)}`);
          const allUserPlayerIds = await this.cacheRepository.getTypedValues("set", { exclude: [event.value.id] });
          this.logger.info(`Player ids to send notification to: ${allUserPlayerIds.toString()}`);

          await this.cacheRepository.addToSet(event.value.id, event.value.playerId);

          // notify "allUserPlayerIds" about a new user signing up via preferred notification service (one signal, firebase, etc)

          return {
            handled: true
          };
        }
      }
    };
  }

  onUserSignIn(): SubscriptionParameters {
    return {
      topic: Topics.UserService,
      eventTypes: [UserEvents.Signin],
      readFromBeginning: true,
      handles: {
        handle: async (event: IntegrationEventRecord<IUserProps>) => {
          this.logger.info(`User Signed In ${JSON.stringify(event.value.id)}`);

          return {
            handled: true
          };
        }
      }
    };
  }

  onUserProfileUpdate(): SubscriptionParameters {
    return {
      topic: Topics.UserService,
      eventTypes: [UserEvents.ProfileUpdate],
      readFromBeginning: true,
      handles: {
        handle: async (event: IntegrationEventRecord<IUserProps>) => {
          this.logger.info(`User updated profile ${JSON.stringify(event.value)}`);

          return {
            handled: true
          };
        }
      }
    };
  }
}

const userConsumer = container.resolve(UserConsumer);

export default [userConsumer.onUserSignup(), userConsumer.onUserSignIn(), userConsumer.onUserProfileUpdate()];
