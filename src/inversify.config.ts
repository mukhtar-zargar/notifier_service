import { Container, interfaces } from "inversify";

import { Logger } from "./infra/logging/pino";
import { TYPES } from "./application/constants/types";
import { CacheRedisRepository } from "./infra/caching/redis";
import { IDomainProducerMessagingRepository } from "./domain/ports/messaging/producer";
import { DomainProducerMessagingRepositoryKafka } from "./infra/messaging/kafka/producer";
import { AppSettings } from "./settings.ts/app.settings";
import { KafkaConfiguration } from "./infra/messaging/kafka/configuration";
import { ICacheRepository } from "./domain/ports/caching/cache_repository_interface";

const container = new Container();

container.bind(TYPES.Logger).to(Logger).inSingletonScope();
container
  .bind<IDomainProducerMessagingRepository>(TYPES.MessagingProducer)
  .toFactory<IDomainProducerMessagingRepository>((context: interfaces.Context) => {
    const producer = new DomainProducerMessagingRepositoryKafka(
      KafkaConfiguration.getKafkaConfiguration({
        KAFKA_BROKERS: [AppSettings.KAFKA_BROKER],
        KAFKA_SASL_USERNAME: AppSettings.KAFKA_SASL_USERNAME || "dummy",
        KAFKA_SASL_PASSWORD: AppSettings.KAFKA_SASL_PASSWORD || "pass",
        KAFKA_CONNECTION_TIMEOUT: 5000,
        KAFKA_CERTIFICATE_BASE64: "122"
      })
    );
    producer.connect();
    return () => producer;
  });
container.bind<ICacheRepository>(TYPES.CacheRepository).toFactory<ICacheRepository>((context: interfaces.Context) => {
  console.log(
    "REDIS URL",
    `redis://${AppSettings.REDIS_USERNAME}${AppSettings.REDIS_PASSWORD ? ":" + AppSettings.REDIS_PASSWORD : ""}${
      AppSettings.REDIS_USERNAME ? "@" : ""
    }${AppSettings.REDIS_HOST}:${AppSettings.REDIS_PORT}/${AppSettings.REDIS_DEFAULT_DB}`
  );
  const cacheRepository = new CacheRedisRepository({
    url: `redis://${AppSettings.REDIS_USERNAME}${AppSettings.REDIS_PASSWORD ? ":" + AppSettings.REDIS_PASSWORD : ""}${
      AppSettings.REDIS_USERNAME ? "@" : ""
    }${AppSettings.REDIS_HOST}:${AppSettings.REDIS_PORT}/${AppSettings.REDIS_DEFAULT_DB}`
  });

  cacheRepository.connect();

  return () => cacheRepository;
});

export { container };
